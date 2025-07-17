const secret = otplib.authenticator.generateSecret()
document.getElementById('secretKey').textContent = secret
const label = encodeURIComponent('2FAeg Demo')
const issuer = encodeURIComponent('2FAeg')
const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`
QRCode.toCanvas(document.getElementById('qrcode'), otpauth, function (error) {
  if (error) console.error(error)
})
function verifyCode() {
  const codeInput = document.getElementById('codeInput').value.trim()
  const messageDiv = document.getElementById('message')
  if (otplib.authenticator.check(codeInput, secret)) {
    messageDiv.textContent = "2FA verification successful! JS continues…"
    messageDiv.style.color = "green"
  } else {
    messageDiv.textContent = "Incorrect code. Please try again."
    messageDiv.style.color = "red"
  }
}
console.log("Secret for Authenticator:", secret)
console.log("otpauth URI:", otpauth)
