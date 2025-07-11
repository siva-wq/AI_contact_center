const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en', 'te'], forceNER: true });

/** ─────── Account: Balance ─────── **/
manager.addDocument('en', 'check my account balance', 'account.balance');
manager.addDocument('en', 'what is my balance', 'account.balance');
manager.addDocument('en', 'show my bank balance', 'account.balance');

manager.addDocument('te', 'నా ఖాతాలో ఎంత ఉంది', 'account.balance');
manager.addDocument('te', 'నాకు నా బ్యాలెన్స్ తెలుసుకోవాలి', 'account.balance');
manager.addDocument('te', 'నా ఖాతా బాలెన్స్ చూపించు', 'account.balance');

manager.addAnswer('en', 'account.balance', 'Your current balance is ₹10,000.');
manager.addAnswer('te', 'account.balance', 'మీ ఖాతాలో ₹10,000 ఉంది.');

/** ─────── Account: Bill ─────── **/
manager.addDocument('en', 'show my bill', 'account.bill');
manager.addDocument('en', 'what is my latest bill', 'account.bill');
manager.addDocument('en', 'get my current bill', 'account.bill');

manager.addDocument('te', 'నా బిల్లు చూపించండి', 'account.bill');
manager.addDocument('te', 'నా చివరి బిల్లు ఎంత', 'account.bill');
manager.addDocument('te', 'ప్రస్తుత బిల్లు చూపించు', 'account.bill');

manager.addAnswer('en', 'account.bill', 'I will check your bill.');
manager.addAnswer('te', 'account.bill', 'నేను మీ బిల్లు చెక్ చేస్తాను.');

/** ─────── Account: Late Fee ─────── **/
manager.addDocument('en', "what happens if I don't pay my bill", 'account.lateFee');
manager.addDocument('en', "what if I miss my payment", 'account.lateFee');
manager.addDocument('en', "consequences of not paying bill", 'account.lateFee');

manager.addDocument('te', "నేను బిల్లు చెల్లించకపోతే ఏమవుతుంది?", 'account.lateFee');
manager.addDocument('te', "నాకు చెల్లింపు మిస్ అయితే ఏం?", 'account.lateFee');
manager.addDocument('te', "బిల్లు చెల్లించకపోతే ఏం జరగుతుంది", 'account.lateFee');

manager.addAnswer('en', 'account.lateFee', 'If you don’t pay your bill on time, you may be charged a late fee or service could be interrupted.');
manager.addAnswer('te', 'account.lateFee', 'మీరు బిల్లును సకాలంలో చెల్లించకపోతే, ఆలస్య రుసుము విధించబడవచ్చు లేదా సేవకు అంతరాయం కలగవచ్చు.');


manager.addDocument('te', 'సహాయం కావాలి', 'help');
manager.addDocument('te', 'మీరు నాకు సహాయం చేస్తారా', 'help');
manager.addDocument('te', 'దయచేసి నాకు సహాయం చేయండి', 'help');

manager.addAnswer('te', 'help', 'తప్పకుండా! మీరు ఏ విషయంలో సహాయం కోరుతున్నారు?');

/*
manager.addDocument('en', 'thank you', 'gratitude.thanks');
manager.addDocument('en', 'ok thanks', 'gratitude.thanks');
manager.addDocument('en', 'thank you for helping me', 'gratitude.thanks');
manager.addDocument('en', 'thank you for solving my issue', 'gratitude.thanks');
manager.addDocument('en', 'thanks a lot', 'gratitude.thanks');
manager.addDocument('en', 'appreciate the help', 'gratitude.thanks');

manager.addAnswer('en', 'gratitude.thanks', 'You’re welcome! I’m glad your issue is solved.');


manager.addDocument('en', 'who are you', 'info.identity');
manager.addDocument('en', 'what is your name', 'info.identity');
manager.addDocument('en', 'can you tell me about yourself', 'info.identity');
manager.addDocument('en', 'who is this', 'info.identity');

manager.addAnswer('en', 'info.identity', 'I’m your virtual assistant, here to help you with account-related questions.');
*/


/** ─────── Train and Save ─────── **/
const trainAndSave = async () => {
  await manager.train();
  await manager.save();
  console.log("NLP model trained and saved.");
};

trainAndSave();

module.exports = manager;
