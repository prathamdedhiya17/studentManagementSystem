export function dateFormatter(date: Date) {
    let formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    formattedDate = formattedDate.replace(/\//g, '-');

    return formattedDate;
}

export function dateTimeFormatter(date: Date) {
    let formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    formattedDate = formattedDate.replace(/\//g, '-');

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (`${formattedDate}, ${formattedTime}`).toLocaleLowerCase();
}

export function APIdateFormatter(unFormattedDate: Date) {
    const date = unFormattedDate.getDate().toString();
    const month = (unFormattedDate.getMonth()+1).toString();
    const year = unFormattedDate.getFullYear().toString();

    const formattedDate = `${year}-${month.length<2?0+month:month}-${date.length < 2 ? 0+date : date}`

    return formattedDate;
}

export function timeConverter(time: string) {
    const trimmedTime = time.slice(0, 5).trim();
    const timeFormat = time.slice(time.length - 2);

    const hour = trimmedTime.slice(0, 2).replace(':', '');
    const minute = trimmedTime.slice(trimmedTime.length - 2);

    if (timeFormat === 'AM') {
        return trimmedTime;
    }

    return (parseInt(hour, 10) + 12).toString() + ':' + minute;
}

export function timeConverterTo12Hour(time: string) {
    const splitTime = time.split(':')
    if(parseInt(splitTime[0]) > 11) {
        return `${parseInt(splitTime[0]) - 12}:${splitTime[1]} PM`
    }
    return `${splitTime[0]}:${splitTime[1]} AM`
}