const ResetPasswordMessage=(buf)=>{
    
   return `
<h1>Reset password</h1>
<br><h4>that's your code to reset your password</h4>
<br><h3>${buf}</h3>
`
}
const ActivateEmailMessage=(buf)=>{
    return `
    <h1>ActivateEmail</h1>
    <br><h4>that's your Activation code </h4>
    <br><h3>${buf}</h3>
`
}



module.exports={
    ResetPasswordMessage
    ,ActivateEmailMessage


}