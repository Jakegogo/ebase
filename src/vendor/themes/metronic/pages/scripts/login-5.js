var Login = function() {

    var handleLogin = function() {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "请输入用户名."
                },
                password: {
                    required: "请输入密码."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                //form.submit(); // form validation success, call ajax form submit
                $.ajax({
                    type: 'post', // 提交方式 get/post
                    url: '/api/ebase/login', // 需要提交的 url
                    data: {
                        'username': $('#username').val(),
                        'password': $('#password').val()
                    },
                    headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
                    success: function(data) { // data 保存提交后返回的数据，一般为 json 数据
                        if (data && data.data == 'success') {
                            location.href = "/";
                        }
                    },
                    error: function(jqXHR, textStatus, errorMessage) {
                        console.log(jqXHR.responseText); // Optional
                        $('.alert-danger', $('.login-form')).show();
                        $('.alert-danger span', $('.login-form')).text(jqXHR.responseText);
                    },
                });
                return false; // 阻止表单自动提交事件
            }
        });

        $('.login-form input').keypress(function(e) {
            if ($('.login-form').validate().form()){
                $('.alert-danger', $('.login-form')).hide();
            }
            if (e.which == 13) {
                $('.login-form').submit(); //form validation success, call ajax form submit
                return false;
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        $('#forget-password').click(function(){
            $('.login-form').hide();
            $('.forget-form').show();
        });

        $('#back-btn').click(function(){
            $('.login-form').show();
            $('.forget-form').hide();
        });

    }

 
  

    return {
        //main function to initiate the module
        init: function() {

            handleLogin();

            // init background slide images
            $('.login-bg').backstretch([
                "vendor/themes/metronic/pages/img/login/bg1.jpg",
                "vendor/themes/metronic/pages/img/login/bg2.jpg",
                "vendor/themes/metronic/pages/img/login/bg3.jpg"
                ], {
                  fade: 1000,
                  duration: 8000
                }
            );

            $('.forget-form').hide();

        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});