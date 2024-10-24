export const getQueryParams = (req: Request, field: string) => {
    const url = new URL(req.url);
    const returnValue = url.searchParams.get(field);

    return returnValue;
};