export const regular_phone = function (val) {
    const regex = /^1([3|4|5|7|8|])\d{9}$/
    return regex.test(val)
}
export const regular_password = function (val) {
    const regex = /^[0-9A-Za-z]{6,16}$/
    return regex.test(val)
}