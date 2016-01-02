/**
 * 表单验证配置
 * @type {{}}
 */
var validatorConfig ={
    email: {
        email: "输入邮箱地址格式不正确"
    },
    username: {
        pattern: "用户名必须输入字母、数字、下划线,以字母开头",
        w5cuniquecheck: "输入用户名已经存在，请重新输入"
    },
    password: {
        minlength: "密码长度不能小于{minlength}",
        maxlength: "密码长度不能大于{maxlength}"
    },
    repeatPassword: {
        repeat: "两次密码输入不一致"
    }
}