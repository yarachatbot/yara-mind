const fs=require('fs')

async function lastConvo(user_id){
    var convos
    convos = fs.readFileSync(`${user_id}.txt`,
    {encoding:'utf8', flag:'r'}).toString().split('\n');;
    // Read the text file
    var lastConvos=convos.slice(Math.max(convos.length - 4, 1))
    // console.log(convos[0])
    return {"name":convos[0],"last_convo":lastConvos}

}
module.exports=lastConvo