export const transformVisibility = (visibility: string): string => {
    if (visibility === 'public') {
        return 'Yes';
    } else if (visibility === 'private') {
        return 'No';
    }
    return visibility;
}
export const formatDate = (dateTimeValue: string): string => {
    const date = new Date(dateTimeValue);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/New_York',
    };
    const [month, day, year] = date.toLocaleDateString('en-US', options).split('/');
    return `${year}-${month}-${day}`;
};