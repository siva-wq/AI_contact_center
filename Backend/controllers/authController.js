const User = require("../models/users")
const Chat = require("../models/Chat")
const Issue = require("../models/Issues")

const bcrypt = require("bcryptjs")
const manager = require('../models/nlp')

const getGeminiResponse = require('../models/gemini');
let language = '';

//user
const createUser = async (req, res) => {
    console.log("create user")
    try {
        const { name, email, password, role, lang } = req.body
        console.log(req.body)
        const userexist = await User.findOne({ email });
        if (userexist)
            return res.status(400).json({ message: "user exist" })
        const hashpass = await bcrypt.hash(password, 10);
        language = lang;
        const newuser = new User({
            name,
            email,
            password: hashpass,
            role
        })
        await newuser.save()
        res.status(201).json({ status: true, id: newuser._id });
    } catch (e) {
        console.log(`${e} from create user`)
        console.log(req.body)
        res.status(500).json({ status: false, message: "error" })
    }
}

const LoginUser = async (req, res) => {
    console.log("login user")
    try {
        const { email, password, lang } = req.body
        const user = await User.findOne({ email });
        language = lang;
        if (!user)
            return res.status(400).json({ message: "invalid credentials" })
        if (user.role == "admin") {
            if (user.password == password)
                return res.status(201).json({ status: true, id: user._id, role: user.role })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: "wrong password" })

        res.status(201).json({ status: true, id: user._id, role: user.role })
    } catch (e) {
        console.log(`${e} from Loginuser`)
        res.satus(500).json({ status: false, message: "error" })
    }

}

const forgotpass = async (req, res) => {
    console.log("forgot pass")
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const hashpass = await bcrypt.hash(password, 10);
        user.password = hashpass;
        await user.save();
        res.status(200).json({ status: true, message: "password changed successfully" });

    } catch (e) {
        console.error("Error in password change", e);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

const getUser = async (req, res) => {
    console.log("get user")
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({ status: false, message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.status(200).json({
            status: true,
            username: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (e) {
        console.error("Error in getUser:", e);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
    console.log("get all user")
    try {
        const users = await User.find({ role: { $ne: 'admin' } }, '-password');
        res.status(200).json({ status: true, users })
    }
    catch (e) {
        console.log("Error from get all users:\n", e)
        res.status(500).json({ status: false, error: e });
    }
}

const updateIssue = async (userId, message) => {
    console.log("update issue")
    try {

        let issue = await Issue.findOne({ userId });

        if (!issue) {
            issue = new Issue({
                userId: userId,
                Issue: message,
                istatus: false,
            })
        } else {

            issue.Issue = `\n${message}`;
        }
        await issue.save();
        console.log("Issue updated or created:", issue);
    } catch (error) {
        console.error("Error updating issue:", error);
    }
};


//chat

const chat = async (req, res) => {
    console.log("chat")
    const { userId, sender, message, lang } = req.body;

    try {
        let chat = await Chat.findOne({ userId });
        if (!chat) {
            chat = new Chat({ userId, messages: [] });
        }

        if (!Array.isArray(chat.messages)) {
            chat.messages = [];
        }

        chat.messages.push({ sender, message });
        const lowerMsg = message.toLowerCase();
        let reply = "";

        const response = await manager.process(lang, message.trim());
        const intent = response.intent;
        const confidence = response.score;

        console.log("NLP Response:", response);

        if (lowerMsg.includes("human agent")) {
            chat.esclateToHuman = true;
            reply = "OK, connecting to a human agent. Please wait... A human agent will reply shortly.";
        }
        else if (
            intent === 'report.issue' ||
            (lowerMsg.includes("issue") && !lowerMsg.includes("solved") && !lowerMsg.includes("thank"))
        ) {
            await updateIssue(userId, message);
            let issue = await Issue.findOne({ userId });
            issue.istatus = false;
            await issue.save();

            reply = `I think your issue will be resolved. Please check once.\nIf your issue is not solved, please include "Human Agent" in your next message.`;
        }

        else if (response.answer && confidence >= 0.6) {
            reply = response.answer;
        }

        else if (confidence < 0.6) {
            switch (intent) {
                case 'account.balance':
                    reply = "Sorry, I couldn’t understand your balance request clearly.";
                    break;
                case 'account.bill':
                    reply = "Sorry, I couldn’t understand your bill inquiry.";
                    break;
                case 'account.lateFee':
                    reply = "Sorry, I couldn’t understand your late fee question.";
                    break;
                case 'gratitude.thanks':
                    reply = "Thanks! Let me know if you need anything else.";
                    break;
                default:

                    reply = await getGeminiResponse(message);
                    if (reply.toLowerCase().includes("human agent")) {
                        chat.esclateToHuman = true;
                        reply = "Sorry, I am unable to answer your query. I am connecting you to a human agent.";
                    }
            }
        }

        else {
            reply = await getGeminiResponse(message);
            if (reply.toLowerCase().includes("human agent")) {
                chat.esclateToHuman = true;
                reply = "Sorry, I am unable to answer your query. I am connecting you to a human agent.";
            }
        }

        chat.messages.push({ sender: "bot", message: reply });
        await chat.save();

        res.status(200).json({ status: true, botmsg: reply });

    } catch (e) {
        console.log(`${e}`);
        res.status(500).json({ status: false, error: e.message });
    }
};


const getMsg = async (req, res) => {
    console.log("get msg")
    try {
        const { userId } = req.params;
        const chat = await Chat.findOne({ userId });
        if (!chat)
            return res.status(200).json({ messages: [] });
        res.status(200).json({ messages: chat.messages });
    } catch (e) {
        console.log(`${e}`)
        res.status(500).json({ status: false, error: e })
    }
}

const getescalated = async (req, res) => {
    console.log("get escalated")
    const escalatedChats = await Chat.find({ esclateToHuman: true }).populate("userId", "name email");
    res.status(200).json({ status: true, escalatedChats });
}
const removeescalataed = async (req, res) => {
    console.log("removeescalataed")
    const { userId } = req.params;
    const chat = await Chat.findOne({ userId })
    if (chat.esclateToHuman) {
        chat.esclateToHuman = false;
    }
    res.status(200).json({ status: true })
}

//Issue
const getIssue = async (req, res) => {
    console.log("getIssue")

    const { userId } = req.params;
    try {
        const issue = await Issue.findOne({ userId });
        if (!issue)
            return res.status(200).json({ status: false, message: "no issues" })
        res.status(200).json({ status: true, message: "issue occur", issues: issue })
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: false, message: e })
    }
}

const getAllIssues = async (req, res) => {
    console.log("getallIssue")

    const issues = await Issue.find().populate("userId", "name email");
    res.status(200).json({ status: true, allissues: issues })
}


//Take control

const TakeOver = async (req, res) => {
    console.log("TakeOver")

    const { userId, isTakenOver } = req.body;

    try {
        let chat = await Chat.findOne({ userId });


        if (!chat) {
            chat = new Chat({ userId, messages: [], isTakenOver });
        } else {
            chat.isTakenOver = isTakenOver;
        }

        await chat.save();

        res.status(200).json({
            status: true,
            message: `Chat ${isTakenOver ? "taken over" : "released"} successfully`,
        });
    } catch (err) {
        console.error("TakeOver error:", err);
        res.status(500).json({ status: false, message: "Failed to update takeover status" });
    }
};

const isTakenOVer = async (req, res) => {
    console.log("isTakenOVer")

    try {
        const { userId } = req.params;
        const chat = await Chat.findOne({ userId })
         if (!chat) {
            chat = new Chat({ userId, messages: []});
        } else {
           

        if (chat.isTakenOver) {
            return res.status(200).json({ status: true })
        }
    }
        res.status(200).json(200).json({ status: false })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
}


const saveMsg = async (req, res) => {
    console.log("saveMsg")

    const { userId, sender, message } = req.body;

    try {
        let chat = await Chat.findOne({ userId });

        if (!chat) {
            chat = new Chat({ userId, messages: [] });
        }

        chat.messages.push({
            sender,
            message,
            timestamp: new Date(),
        });

        await chat.save();

        res.status(200).json({ status: true, message: "Message saved from admin" });
    } catch (err) {
        console.error("Admin message save error:", err);
        res.status(500).json({ status: false, message: "Error saving admin message" });
    }
};


module.exports = { createUser, LoginUser, getUser, chat, getMsg, getAllUsers, forgotpass, getescalated, removeescalataed, getIssue, getAllIssues, TakeOver, saveMsg, isTakenOVer };