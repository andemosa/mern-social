export const getErrorMessage = (arr: Array<any>) => {
  let errorMessage = "";
  for (const obj of arr) {
    errorMessage = errorMessage + "\n" + obj.message;
  }
  return errorMessage;
};
