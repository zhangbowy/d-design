import { KEY_EVENT_WRITE } from "../api";
import { getQueryVariable } from "./utils";
import * as dd from "dingtalk-jsapi"; //dingtalk-jsapi  https://open.dingtalk.com/document/isvapp-client/read-before-development

/**
 * remind dd to user
 * @param {Object|Array} user
 */
export const handleRemindDD = (
    user,
    content,
    taskId,
    trait,
    press = false,
    keyEventUrgeCommand = null
) => {
    let users = [];
    let corpId = getQueryVariable("corpId");
    let appId = getQueryVariable("appId");
    let clientId = getQueryVariable("clientId");
    let ddAppId = appId.substring(2);
    let appUrl = `dingtalk://dingtalkclient/action/openapp?corpid=${corpId}&container_type=work_platform&app_id=${ddAppId}&redirect_type=emit_params&params=&redirect_url=${encodeURIComponent(
        `https://qzz-static.forwe.store/public-assets/coolapp.html?corpId=${corpId}&appId=${appId}&clientId=${clientId}&taskId=${taskId}&app=${trait}&mode=${import.meta.env.MODE}`
    )}`;
    console.log(appUrl,user,
        content,
        taskId,
        trait,);

    if (user instanceof Array) {
        user.map((el) => {
            users.push(el.userId);
        });
    }
    if (user instanceof Object) {
        users.push(user.userId);
    }
    if (dd.env.platform != "notInDingTalk") {
        dd.biz.ding.create({
            users: users,
            corpId: corpId,
            type: 2,
            alertType: 2,
            alertDate: {
                format: "yyyy-MM-dd HH:mm:ss",
                value: "",
            },
            attachment: {
                title: content,
                url: appUrl,
                image: "https://daily-static-file.oss-cn-shanghai.aliyuncs.com/qzp-img-logo.svg",
                text: "任务",
            },
            text: "",
            bizType: 0,
            confInfo: {
                bizSubType: 0, //子业务类型如会议：0：预约会议；1：预约电话会议；2：预约视频会议；（注：目前只有会议才有子业务类型）
                location: "某某会议室", //会议地点；（非必填）
                startTime: {
                    format: "yyyy-MM-dd HH:mm",
                    value: "2015-05-09 08:00",
                }, //会议开始时间
                endTime: {
                    format: "yyyy-MM-dd HH:mm",
                    value: "2015-05-09 08:00",
                }, //会议结束时间
                remindMinutes: 30, //会前提醒。单位分钟-1：不提醒；0：事件发生时提醒；5：提前5分钟；15：提前15分钟；30：提前30分钟；60：提前1个小时；1440：提前一天；
                remindType: 2, //会议提前提醒方式。0:电话, 1:短信, 2:应用内
            },

            taskInfo: {
                ccUsers: ["100", "101"], //抄送用户列表，工号
                deadlineTime: {
                    format: "yyyy-MM-dd HH:mm",
                    value: "2015-05-09 08:00",
                }, //任务截止时间
                taskRemind: 30, //任务提醒时间，单位分钟0：不提醒；15：提前15分钟；60：提前1个小时；180：提前3个小时；1440：提前一天；
            },

            onSuccess: async function () {
                if (press) {
                    await KEY_EVENT_WRITE({
                        keyEventUrgeCommand,
                        action: "URGE_TASK",
                    });
                }
            },
            onFail: function () {},
        });
    }
};
