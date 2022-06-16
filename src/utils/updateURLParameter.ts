export default function updateURLParameter(
    url: string,
    param: string,
    paramVal: string
) {
    let newAdditionalURL = '';
    let tempArray = url.split('?');
    const baseURL = tempArray[0];
    const additionalURL = tempArray[1];
    let temp = '';
    if (additionalURL) {
        tempArray = additionalURL.split('&');
        for (let i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    }

    const rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt;
}
