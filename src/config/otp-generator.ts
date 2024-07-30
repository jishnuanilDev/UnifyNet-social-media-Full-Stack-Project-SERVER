export const otpGenerator = (length: number) => {
  let otp = "";
  const digits = "0123456789";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digits.length);
    otp += index;
  }
  return otp;
};
