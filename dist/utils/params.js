export const getParam = (value) => {
    if (!value)
        throw new Error("Missing parameter");
    return Array.isArray(value) ? value[0] : value;
};
//# sourceMappingURL=params.js.map