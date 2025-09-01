export const getValue = <T extends string | number>(
  createValue: T,
  editValue: T,
  pathname: string
): T => {
  return pathname.includes("edit") ? editValue : createValue;
};

export const setValue = <T extends string | number>(
  setCreateValue: (value: T) => void,
  setEditValue: (editValue: T) => void,
  value: T,
  pathname: string
) => {
  return pathname.includes("edit")
    ? setEditValue(value)
    : setCreateValue(value);
};
