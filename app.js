const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');
const { ProfilingLevel } = require('mongodb');


// Connect to the DataBase 
/** 
mongoose.connect('mongodb+srv://TraceGenie:jJmY7IUNyWKuG02d@cluster0.5xxuh.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('connected',() =>{
  console.log("Mongoose Connected");
}); 

// New Schema 

const Schema = mongoose.Schema;
const PersonSchema = new Schema({
  postcode:String,
   address: String,
   name:String,
   phone:String,
   sales:String
});

// Model

// const Person = mongoose.model('Person',PersonSchema);

//saving data to mongo


*/
// Web Scraping
const cookie = 'PHPSESSID=2cc141bbb6629b026ddf9969e15b4743; amember_nr=7e97e297576a8a2fce582df18b794ecc';
const postcode = 'GU21 2AA';

const ggs = (k,i)=>{
    return new Promise((resolve,reject)=>{
      setTimeout(() => {
        axios.get(`https://www.tracegenie.com/amember4/amember/prov/allpc.php?s=${k*10}&q6=GU21%202AA`,{ headers: {
      Cookie: cookie,
    }}).then(urlResponse => {  
      
      const $ = cheerio.load(urlResponse.data);
    
      const address = $(`body > div:nth-child(${i*15}) > table > tbody > tr:nth-child(2) > td:nth-child(1) > font`).find("b").html().split("<br>")[0].trim();
      const name = $(`body > div:nth-child(${i*15}) > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > font`).find('b').text().split(' ').join('').split(' ').join(' ');
      const sales = $(`body > div:nth-child(${i*15}) > table > tbody > tr:nth-child(3) > td:nth-child(3) > font`).find('b').text().trim().split('\t').join('').split('\n        ').join(' ');
      const phone = $(`body > div:nth-child(${i*15}) > table > tbody > tr:nth-child(3) > td:nth-child(1) > b`).text().trim();
      const data = {
        postcode:postcode,
        address: address,
        name: name,
        phone: phone,
        sales:sales
      };
    /**   console.log(address.replace(/ /g, "%20"));
      console.log(i);
*/
      axios.get(`https://www.tracegenie.com/amember4/amember/prov/occs2.php?q52o=${address}&q322o=GU21%202AA`,{ headers: {
      Cookie: cookie
      }}).then(urlResponse => {

  const $ = cheerio.load(urlResponse.data);

  const ocuupants = $("body > font:nth-child(2)").find('b').text().replace(/\'/g, '').split(/(\d+)/);
  console.log(ocuupants)
});
      resolve(true);
     /** const newPerson = new Person(data);
      // .save()
      newPerson.save((error) => {
      
        if(error){
          throw error;
        } else {
          console.log("Data Has been saved!!!" + i);
          resolve(true);
        }
      });**/
    
    
    
    }).catch(function (error) {
      console.log(error.toJSON());
      //reject(false);
    });
      }, 0);
    });
  }


const main = async ()=>{
  for(let k=1 ;k<10;k++){
    for(let i = 1 ;i <= 10; i++){
    
        await ggs(k,i);
     
    }
    }
}
  
main();




// for ending



/** axios.get('https://www.tracegenie.com/amember4/amember/prov/get9atest.php?q629=46%20VICTORIA%20ROAD&q729=GU21%202AA&q59=BRAITHWAITE&q329=PAUL',{ headers: {
  Cookie: cookie
}}).then(urlResponse => {

  const $ = cheerio.load(urlResponse.data);

  $("body a").each((i,element)=>{
  
   const status = $(element)
   .find('img')
   .attr('src');
   
   const reesult = Boolean(status.includes('y')).toString().replace("true","yes").replace("false","no");

   console.log((2022-i) + " voters roll - " + reesult);
   console.log(typeof(parseInt('123', 10)));
  });
});*/
 