var cron = require("node-cron");
const user = require("../models/user.model");
const { Op } = require("sequelize");
const moment = require("moment");
const Insemination = require("../models/Insemination.model");
const role = require("../models/role.model");
const { sendNotification } = require("./notification");
const notification = require("../models/notification.model");
const { enumNotification, enumStatus } = require("./enum");
const animals = require("../models/animals.model");

//!  send notification at 12:00:00
module.exports.notification = async () => {
    let taskBirthCheck = cron.schedule("0 0 0 * * *", async () => {
        // تنبيه : ولادة قريبة"
        // console.log(1);
        let nearBirth = await Insemination.findAll({
            attributes: ["animalId", ["InseminationDate", "date"]],
            raw: true,
            where: {
                state: true,
                dateBirth: { [Op.eq]: null },
            },
        }); 
        if (nearBirth.length) {
            nearBirth = nearBirth.filter(
                (birthIns) =>
                    moment().subtract(8, "month",true).format("YYYY-MM-DD") >=
                    birthIns.date
            );
            // console.log(nearBirth);

            let allIdRole = await role.findAll({
                raw: true,
                attributes: ["id", "data"],
            });
            let allRoleForMessageBirth = []; 
            Promise.all(
                allIdRole.map(async (myRole) => {
                    let permissionRole =  
                        JSON.parse(myRole.data)
                    .permission;
                    if (
                        permissionRole.includes("surveillance section") ||
                        permissionRole.includes("Production section")
                    )
                        allRoleForMessageBirth.push(myRole.id);
                })
            );
            // get user to send notification
            let usersSender = await user.findAll({
                attributes: ["tokenDevice", "id"],
                raw: true,
                where: {
                    roleId: { [Op.in]: allRoleForMessageBirth },
                },
            });

            Promise.all(
                nearBirth.map((BornCow) => {
                    let message = {
                        title: "تنبيه : ولادة قريبة",
                        message: `ان البقرة رقم ${BornCow.animalId} تبقى شهر لعملية الولادة`,
                    };
                    // send message for every  userSender
                    Promise.all(
                        usersSender.map(async (userInfo) => {
                            await sendNotification(
                                userInfo.tokenDevice,
                                message
                            ); 
                            await notification.create({
                                title: message.title,
                                message: message.message,
                                userId: userInfo.id,
                                type: enumNotification.birth,
                                state:false,
                            });
                        })
                    );
                })
            );
        }
    });
    let taskCarryCheck = cron.schedule("0 0 0 * * *", async () => {
        let carryCheck = await Insemination.findAll({
            attributes: ["animalId", ["InseminationDate", "date"]],
            raw: true,
            where: {
                state: null,
                dateBirth: { [Op.eq]: null },
            },
        });

        if (carryCheck.length) {
            carryCheck = carryCheck.filter((birthIns) => {
                return (
                    moment().subtract(20, "day").format("YYYY-MM-DD") >=
                    birthIns.date
                );
            });

            //! get all role have this permission => "surveillance section" or "Production section"
            let allIdRole = await role.findAll({
                raw: true,
                attributes: ["id", "data"],
            });
            let allRoleForMessageCarryCheck = [];

            Promise.all(
                allIdRole.map(async (myRole) => {
                    let permissionRole =  
                        JSON.parse(myRole.data)
                     .permission;
                    if (
                        permissionRole.includes("surveillance section") ||
                        permissionRole.includes("Production section")
                    )
                        allRoleForMessageCarryCheck.push(myRole.id);
                })
            );
            //! get user to send notification and is have roles
            let usersSender = await user.findAll({
                attributes: ["tokenDevice", "id"],
                raw: true,
                where: {
                    roleId: { [Op.in]: allRoleForMessageCarryCheck },
                },
            });

            //! send notification
            Promise.all(
                carryCheck.map((BornCow) => {
                    let message = {
                        title: "تنبيه : فحص حمل",
                        message: `ان البقرة رقم ${BornCow.animalId} تجاوزت ال20 يوم من  تاريخ الالقاح الرجاء لقيام بعملية فحص الحمل`,
                    };
                    // send message for every  userSender
                    Promise.all(
                        usersSender.map(async (userInfo) => {
                            await sendNotification(
                                userInfo.tokenDevice,
                                message
                            ); 
                            await notification.create({
                                title: message.title,
                                message: message.message,
                                userId: userInfo.id,
                                type: enumNotification.birth,
                                state:false,
                            });
                        })
                    );
                })
            );
        }
    });

    // من اجل تعديل جميع الابقار يلي ضللها شهرين للولادة ونحطهن بمرحلة الجفاف
    let taskEditEveryCowDry = cron.schedule("0 0 0 * * *", async () => {
        let carryCheck = await Insemination.findAll({
            raw: true,
            where: {
                state: true,
                dateBirth: { [Op.eq]: null },
            },
        });

        if (carryCheck.length) {
            Promise.all(
                carryCheck.map(async (cowInsemination) => {
                    // اذا كان الفرق بين تاريخ اليوم وتاريخ (الالقاح + 7 اشهر) اقل او يساوي شهرين بهل الحالة عدل حالتها وحطها جفاف
                    //  طبعا في حال كانت مانها مولدة وحامل
                    if (
                        moment().diff(
                            moment(cowInsemination.InseminationDate).add(
                                7,
                                "months"
                            ),
                            "months"
                        ) <= 2
                    ) {
                        await animals.update(
                            { Status: enumStatus.DRY },
                            { where: { animalId: cowInsemination.animalId } }
                        );
                    }
                })
            );
        }
    });

    // من اجل حذف جمي عالقاحت التي لم يتم ادخال حالتها بعد الانشاء بشهر 
    let taskDeleteNotHaveAnyStateIns = cron.schedule("0 0 0 * * *", async () => {
        let carryCheck = await Insemination.findAll({
            raw: true,
            where: {
                state: null,
                dateBirth:   null ,
            },
        });
       
        if (carryCheck.length) {
            Promise.all(
                carryCheck.map(async (cowInsemination) => {
 
                    let now=moment();
                    let date=moment(cowInsemination.InseminationDate)
               
                     if (
                        now.diff(
                            date,
                            "months"
                        ) >=1
                    ) {
            
                        await Insemination.destroy({force:true,where:{animalId:cowInsemination.animalId,InseminationDate:cowInsemination.InseminationDate, InseminatedBullId:cowInsemination. InseminatedBullId}})
                    }
                })
            );
        }
    });
    taskBirthCheck.start();
    taskCarryCheck.start();
    taskDeleteNotHaveAnyStateIns.start();
    taskEditEveryCowDry.start();
};
