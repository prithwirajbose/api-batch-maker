var API_PATH = 'http://localhost:8080';

var handleError = function(xhr, status, err) {
    //alert(JSON.stringify(xhr));
};

var showLoading = function() {
    $('.loading').show();
};

var hideLoading = function() {
    $('.loading').hide();
};

var xhr = function(userConfig) {
    if (_.isNil(userConfig) || _.isNil(userConfig.url)) {
        throw 'Required config missing';
    }
    var isPost = _.toLower(_.get(userConfig, 'method', 'get')) == 'post';
    var reqData = null;
    if (!_.isNil(userConfig.form) && $(userConfig.form).length > 0) {
        reqData = $.serialize(userConfig.form);
    } else if (_.isObject(userConfig.data)) {
        reqData = JSON.serialize(userConfig.data);
    } else {
        reqData = userConfig.data;
    }
    var config = {
        url: (userConfig.url.indexOf('http://') !== -1 || userConfig.url.indexOf('https://') !== -1) ? userConfig.url : API_PATH + userConfig.url,
        method: isPost ? 'post' : 'get',
        dataType: _.get(userConfig, 'dataType', 'json'),
        data: reqData,
        contentType: _.get(userConfig, 'contentType', (_.isObject(userConfig.data) ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8')),
        crossDomain: true,
        timeout: _.get(userConfig, 'timeout', 0),
        success: function(resp, status, xhr) {
            if (resp && !_.isNil(resp.success) && resp.success === true) {
                if (_.isFunction(userConfig.callback)) {
                    userConfig.success(resp, status, xhr);
                }
            } else {
                handleError(xhr, status, resp.error);
            }
        },
        error: function(xhr, status, err) {
            handleError(xhr, status, err);
            if (_.isFunction(userConfig.error)) {
                userConfig.error(xhr, status, err);
            }
        },
        beforeSend: function(xhr, settings) {
            if ($.active <= 1) {
                showLoading();
            }
        },
        complete: function(xhr, status) {
            if ($.active == 1) {
                hideLoading();
            }
        }
    };

    return $.ajax(config);
};

$(document).ready(function() {

});