const regexLatAndLng =
  /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g;
const regexExtraSpace = /\s+/g;
const regexExtraSlash = /\/\/+/g;
const regexEmail = /^\w+([-.+]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// FIXME: safari environment not work!
// const regexExtraColon = new RegExp('(?<=:)\\w+', 'g')
// const regexExtraColon = new RegExp('(:)[\\s\\S]+', 'g')

export {
  regexLatAndLng,
  regexExtraSpace,
  regexExtraSlash,
  regexEmail,
  // regexExtraColon
};
