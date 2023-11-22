const { Sequelize, Op } = require("sequelize");
const animals = require("../models/animals.model");
const moment = require("moment");
const Insemination = require("../models/Insemination.model");
const { enumGender, enumStatus } = require("../utils/enum");
const notification = require("../models/notification.model");
module.exports.getCount = async (req, res) => {
    try {
        let response = {};

        let animalsFound = await animals.findOne({ raw: true });

        if (animalsFound) {
            // Classification Gender
            let countGender = await animals.findAll({
                raw: true,
                attributes: [
                    "gender",
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: "gender",
                orderBy: "gender",
            });

            if (countGender.length == 1) {
                if (countGender[0]["gender"] === "female") {
                    countGender = { cow: countGender[0]["count"], calf: 0 };
                } else countGender = { cow: 0, calf: countGender[0]["count"] };
            } else {
                countGender = {
                    cow:
                        countGender[0]["gender"] == "female"
                            ? countGender[0]["count"]
                            : countGender[1]["count"],
                    calf:
                        countGender[1]["gender"] == "male"
                            ? countGender[1]["count"]
                            : countGender[0]["count"],
                };
            }

            // if found cow then count
            if (countGender.cow) {
                // count cows

                let dairyCows = await animals.findAll({
                    raw: true,
                    attributes: [
                        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                    ],
                    group: "Status",

                    where: {
                        Gender: enumGender.FEMALE,
                        Status: enumStatus.DAIRY,
                    },
                });

                let dairyWithoutBirth = await Insemination.findAll({
                    raw: true,
                    where: {
                        state: true,
                        dateBirth: { [Op.is]: null },
                    },
                });
                let dairyWithoutBirthCount = 0;
                if (dairyWithoutBirth.length) {
                    dairyWithoutBirthCount = dairyWithoutBirth
                        .map((Element) => {
                            if (
                                moment().diff(
                                    Element.InseminationDate,
                                    "months"
                                ) < 7
                            )
                                return 1;
                            else return 0;
                        })
                        .reduce((ans, next) => ans + next);
                } else dairyWithoutBirthCount = 0;

                let dryCows = await animals.findAll({
                    raw: true,
                    attributes: [
                        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                    ],
                    group: "Status",

                    where: {
                        Gender: enumGender.FEMALE,
                        Status: enumStatus.DRY,
                    },
                });

                let PregnantCows = await Insemination.findAll({
                    raw: true,
                    attributes: [
                        [
                            Sequelize.fn("COUNT", Sequelize.col("animalId")),
                            "count",
                        ],
                    ],
                    group: "state",
                    where: {
                        state: true,
                        dateBirth: null,
                    },
                });

                response.countCow = {
                    countAll: countGender.cow,
                    dairyCows:
                        dairyCows.length === 0
                            ? 0 + dairyWithoutBirthCount
                            : dairyCows[0].count + dairyWithoutBirthCount,
                    dryCows: dryCows.length === 0 ? 0 : dryCows[0].count,
                    PregnantCows:
                        PregnantCows.length === 0
                            ? 0 + dairyCows
                            : PregnantCows[0].count + dairyCows,
                };
            } else {
                response.countCow = {
                    countAll: 0,
                    dairyCows: 0, //الابقار الحلوب
                    dryCows: 0, //الابقار الجافة
                    PregnantCows: 0, //الابقار الحوامل
                };
            }
        } else {
            response.countCow = {
                countAll: 0,
                dairyCows: 0,
                dryCows: 0,
                PregnantCows: 0,
            };
        }

        let countNotification = await notification.findAndCountAll({
            where: { userId: req.user.id, state: false },
        });
        response.countNotification = countNotification.count;

        res.status(200).send({
            success: true,
            data: response,
            msg: "تمت بنجاح",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.GetClassificationGender = async (req, res) => {
    try {
        let response = {};

        let animalsFound = await animals.findOne({ raw: true });

        if (animalsFound) {
            // Classification Gender
            let countGender = await animals.findAll({
                raw: true,
                attributes: [
                    "gender",
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: "gender",
                orderBy: "gender",
            });

            if (countGender.length == 1) {
                if (countGender[0]["gender"] === "female") {
                    countGender = { cow: countGender[0]["count"], calf: 0 };
                } else countGender = { cow: 0, calf: countGender[0]["count"] };
            } else {
                countGender = {
                    cow:
                        countGender[0]["gender"] == "female"
                            ? countGender[0]["count"]
                            : countGender[1]["count"],
                    calf:
                        countGender[1]["gender"] == "male"
                            ? countGender[1]["count"]
                            : countGender[0]["count"],
                };
            }
            response = {
                calf:
                    (countGender.calf / (countGender.cow + countGender.calf)) *
                    100,
                cow:
                    (countGender.cow / (countGender.cow + countGender.calf)) *
                    100,
            };
            // end Classification Gender
        } else {
            response = { calf: 0, cow: 0 };
        }

        res.status(200).send({
            success: true,
            data: response,
            msg: "تمت بنجاح",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.getCalfWithAge = async (req, res) => {
    try {
        let response = {};

        let animalsFound = await animals.findOne({ raw: true });

        if (animalsFound) {
            // Classification Gender
            let countGender = await animals.findAll({
                raw: true,
                attributes: [
                    "gender",
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: "gender",
                orderBy: "gender",
            });

            if (countGender.length == 1) {
                if (countGender[0]["gender"] === "female") {
                    countGender = { cow: countGender[0]["count"], calf: 0 };
                } else countGender = { cow: 0, calf: countGender[0]["count"] };
            } else {
                countGender = {
                    cow:
                        countGender[0]["gender"] == "female"
                            ? countGender[0]["count"]
                            : countGender[1]["count"],
                    calf:
                        countGender[1]["gender"] == "male"
                            ? countGender[1]["count"]
                            : countGender[0]["count"],
                };
            }

            if (countGender.calf) {
                // count calf with age
                let countCalfWithAge = await animals.findAll({
                    attributes: [
                        [
                            "BirthDate",
                            "Age",

                            // Sequelize.fn("MONTH", Sequelize.col("BirthDate")),
                            // "Age",
                        ],
                        [Sequelize.fn("COUNT", "*"), "count"],
                    ],
                    where: {
                        gender: "male",
                        BirthDate: {
                            //
                            [Op.gte]: Sequelize.literal(
                                "DATE_SUB(CURDATE(), INTERVAL 10 MONTH)"
                            ),
                        },
                    },
                    group: ["Age"],
                    orderBy: "Age",
                    raw: true,
                });

                countCalfWithAge = countCalfWithAge.map((calf) => {
                    // console.log(calf);
                    let m1 = moment();
                    let m2 = moment(calf.Age);
                    let ageInMonths = m1.diff(m2, "months", true);

                    if (ageInMonths < 1) {
                        ageInMonths = 1;
                    } else {
                        // console.log(ageInMonths);
                        ageInMonths = Math.floor(ageInMonths);

                        // console.log(ageInMonths);
                    }

                    return {
                        Age: ageInMonths,
                        count: calf.count,
                    };
                });

                let tempData = {};

                countCalfWithAge.forEach((calf) => {
                    if (calf.Age in tempData) {
                        tempData[calf.Age].count += calf.count;
                    } else {
                        tempData[calf.Age] = {
                            Age: calf.Age,
                            count: calf.count,
                        };
                    }
                });

                let sortedData = Object.values(tempData).sort(
                    (a, b) => a.Age - b.Age
                );

                response = sortedData;
                //end  count calf with age
            } else {
                response = [];
            }
        } else {
            response = [];
        }

        res.status(200).send({
            success: true,
            data: response,
            msg: "تمت بنجاح",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.getClassificationCow = async (req, res) => {
    try {
        let response = {};

        let animalsFound = await animals.findOne({ raw: true });

        if (animalsFound) {
            // Classification Gender
            let countGender = await animals.findAll({
                raw: true,
                attributes: [
                    "gender",
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: "gender",
                orderBy: "gender",
            });

            if (countGender.length == 1) {
                if (countGender[0]["gender"] === "female") {
                    countGender = { cow: countGender[0]["count"], calf: 0 };
                } else countGender = { cow: 0, calf: countGender[0]["count"] };
            } else {
                countGender = {
                    cow:
                        countGender[0]["gender"] == "female"
                            ? countGender[0]["count"]
                            : countGender[1]["count"],
                    calf:
                        countGender[1]["gender"] == "male"
                            ? countGender[1]["count"]
                            : countGender[0]["count"],
                };
            }

            // getClassificationCow
            // if found cow then count
            if (countGender.cow) {
                // classificationCow
                let classificationCow = {};
                let curedCow = await Insemination.findAll({
                    raw: true,
                    attributes: [
                        "dateBirth",
                        [
                            Sequelize.fn("COUNT", Sequelize.col("animalId")),
                            "count",
                        ],
                    ],
                    group: "dateBirth",
                    where: { dateBirth: { [Op.is]: null } },
                });
                if (curedCow.length == 0) classificationCow.curedCow = 0;
                else classificationCow.curedCow = curedCow[0]["count"];

                let readyToInseminationCow = await animals.findOne({
                    raw: true,
                    attributes: [
                        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                    ],
                    group: "gender",

                    where: {
                        gender: enumGender.FEMALE,
                        BirthDate: {
                            // عمرها اكبر من 10 اشهر
                            [Op.lte]: moment()
                                .subtract(10, "M")
                                .format("YYYY-MM-DD"),
                        },
                    },
                });

                if (readyToInseminationCow)
                    readyToInseminationCow =
                        readyToInseminationCow["count"] -
                        classificationCow.curedCow;
                else readyToInseminationCow = 0;

                let small =
                    countGender.cow -
                    readyToInseminationCow -
                    classificationCow.curedCow;

                classificationCow.readyToInseminationCow =
                    (readyToInseminationCow / countGender.cow) * 100;

                classificationCow.curedCow =
                    (classificationCow.curedCow / countGender.cow) * 100;

                classificationCow.small = (small / countGender.cow) * 100;
                response = { ...classificationCow };
            } else {
                response.classificationCow = {
                    curedCow: 0,
                    readyToInseminationCow: 0,
                    small: 0,
                };
            }
        } else {
            response.classificationCow = {
                curedCow: 0,
                readyToInseminationCow: 0,
                small: 0,
            };
        }

        res.status(200).send({
            success: true,
            data: response,
            msg: "تمت بنجاح",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

// module.exports.getCount = async (req, res) => {
//     try {
//         let response = {};

//         let animalsFound = await animals.findOne({ raw: true });

//         if (animalsFound) {
//             // Classification Gender
//             let countGender = await animals.findAll({
//                 raw: true,
//                 attributes: [
//                     "gender",
//                     [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
//                 ],
//                 group: "gender",
//                 orderBy: "gender",
//             });

//             if (countGender.length == 1) {
//                 if (countGender[0]["gender"] === "female") {
//                     countGender = { cow: countGender[0]["count"], calf: 0 };
//                 } else countGender = { cow: 0, calf: countGender[0]["count"] };
//             } else {
//                 countGender = {
//                     cow:
//                         countGender[0]["gender"] == "female"
//                             ? countGender[0]["count"]
//                             : countGender[1]["count"],
//                     calf:
//                         countGender[1]["gender"] == "male"
//                             ? countGender[1]["count"]
//                             : countGender[0]["count"],
//                 };
//             }
//             response.classificationGender = {
//                 calf:
//                     (countGender.calf / (countGender.cow + countGender.calf)) *
//                     100,
//                 cow:
//                     (countGender.cow / (countGender.cow + countGender.calf)) *
//                     100,
//             };
//             // end Classification Gender

//             if (countGender.calf) {
//                 // count calf with age
//                 let countCalfWithAge = await animals.findAll({
//                     attributes: [
//                         [
//                             "BirthDate",
//                             "Age",

//                             // Sequelize.fn("MONTH", Sequelize.col("BirthDate")),
//                             // "Age",
//                         ],
//                         [Sequelize.fn("COUNT", "*"), "count"],
//                     ],
//                     where: {
//                         gender: "male",
//                         BirthDate: {
//                             //
//                             [Op.gte]: Sequelize.literal(
//                                 "DATE_SUB(CURDATE(), INTERVAL 10 MONTH)"
//                             ),
//                         },
//                     },
//                     group: ["Age"],
//                     orderBy: "Age",
//                     raw: true,
//                 });

//                 countCalfWithAge = countCalfWithAge.map((calf) => {
//                     let m1 = moment();
//                     let m2 = moment(calf.Age);
//                     return {
//                         Age: moment.duration(m1.diff(m2)).months() + 1,
//                         count: calf.count,
//                     };
//                 });
//                 response.countCalfWithAge = countCalfWithAge;
//                 //end  count calf with age
//             } else {
//                 response.countCalfWithAge = [];
//             }
//             // if found cow then count
//             if (countGender.cow) {
//                 // classificationCow
//                 let classificationCow = {};
//                 let curedCow = await Insemination.findAll({
//                     raw: true,
//                     attributes: [
//                         "dateBirth",
//                         [
//                             Sequelize.fn("COUNT", Sequelize.col("animalId")),
//                             "count",
//                         ],
//                     ],
//                     group: "dateBirth",
//                     where: { dateBirth: { [Op.is]: null } },
//                 });
//                 if (curedCow.length == 0) classificationCow.curedCow = 0;
//                 else classificationCow.curedCow = curedCow[0]["count"];

//                 let readyToInseminationCow = await animals.findOne({
//                     raw: true,
//                     attributes: [
//                         [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
//                     ],
//                     group: "gender",

//                     where: {
//                         gender: enumGender.FEMALE,
//                         BirthDate: {
//                             // عمرها اكبر من 10 اشهر
//                             [Op.lte]: moment()
//                                 .subtract(10, "M")
//                                 .format("YYYY-MM-DD"),
//                         },
//                     },
//                 });

//                 if (readyToInseminationCow)
//                     readyToInseminationCow =
//                         readyToInseminationCow["count"] -
//                         classificationCow.curedCow;
//                 else readyToInseminationCow = 0;

//                 let small =
//                     countGender.cow -
//                     readyToInseminationCow -
//                     classificationCow.curedCow;

//                 classificationCow.readyToInseminationCow =
//                     (readyToInseminationCow / countGender.cow) * 100;

//                 classificationCow.curedCow =
//                     (classificationCow.curedCow / countGender.cow) * 100;

//                 classificationCow.small = (small / countGender.cow) * 100;

//                 response.classificationCow = classificationCow;

//                 // count cows

//                 let dairyCows = await animals.findAll({
//                     raw: true,
//                     attributes: [
//                         [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
//                     ],
//                     group: "Status",

//                     where: {
//                         Gender: enumGender.FEMALE,
//                         Status: enumStatus.DAIRY,
//                     },
//                 });
//                 let dryCows = await animals.findAll({
//                     raw: true,
//                     attributes: [
//                         [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
//                     ],
//                     group: "Status",

//                     where: {
//                         Gender: enumGender.FEMALE,
//                         Status: enumStatus.DRY,
//                     },
//                 });

//                 let PregnantCows = await Insemination.findAll({
//                     raw: true,
//                     attributes: [
//                         [
//                             Sequelize.fn("COUNT", Sequelize.col("animalId")),
//                             "count",
//                         ],
//                     ],
//                     group: "state",

//                     where: {
//                         state: true,
//                     },
//                 });

//                 response.countCow = {
//                     countAll: countGender.cow,
//                     dairyCows: dairyCows.length === 0 ? 0 : dairyCows[0].count,
//                     dryCows: dryCows.length === 0 ? 0 : dryCows[0].count,
//                     PregnantCows:
//                         PregnantCows.length === 0 ? 0 : PregnantCows[0].count,
//                 };

//                 let productivityCow = await productivity.findAll({});
//                 response.productivityCow = productivityCow;
//             } else {
//                 response.classificationCow = {
//                     curedCow: 0,
//                     readyToInseminationCow: 0,
//                 };
//                 response.productivityCow = [];
//                 response.countCow = {
//                     countAll: 0,
//                     dairyCows: 0,
//                     dryCows: 0,
//                     PregnantCows: 0,
//                 };
//             }
//         } else {
//             response.countGender = { cow: 0, calf: 0 };
//             response.countCalfWithAge = [];
//             response.productivityCow = [];
//             response.classificationCow = {
//                 curedCow: 0,
//                 readyToInseminationCow: 0,
//             };
//             response.countCow = {
//                 countAll: 0,
//                 dairyCows: 0,
//                 dryCows: 0,
//                 PregnantCows: 0,
//             };
//         }

//         res.status(200).send({
//             success: true,
//             data: response,
//             msg: "تمت بنجاح",
//         });
//     } catch (error) {
//         res.status(501).send({ success: false, error: error.message });
//     }
// };
