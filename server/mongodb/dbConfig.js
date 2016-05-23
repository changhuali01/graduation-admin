var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/graduation_project');
//连接数据库
var db = mongoose.connection;
db.on('error', function(error){
    console.log(error);
});
db.once('open', function(){
    console.log("graduation_project connect success");
});

//管理员表
var adminSchema = new mongoose.Schema({
    userName: String,
    userPwd : String
});

//用户collection Schema
var userSchema = new mongoose.Schema({
    userName: String,
    phone: String,
    userPwd : String
});

//联系我们collection Schema
var contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    advice: String,
    status: String,
    time: String,
});

//优惠活动collection Schema
var promotionSchema = new mongoose.Schema({
    id: String,
    title: String,
    content: String,
    location: String,
    time: String,
    img: String,
})

//家装案例collection Schema
var familyCaseSchama = new mongoose.Schema({
    id: String,
    title:  String,
    description: String,
    img_1: String,
    img_2: String,
    img_3: String,
    img_4: String,
    img_5: String,
    data: Array,
})

//新闻资讯collection Schema
var imformationSchema = new mongoose.Schema({
    id: String,
    title: String,
    type: String,
    viewNum: Number,
    time: String,
    content: String,
    img: String,
})

//装修效果图collection Schema
var onlineDemoSchema = new mongoose.Schema({
    id: String,
    title: String,
    img: String,
    space: String,
    part: String,
    style: String,
})

//申请collection Schema
var applySchema = new mongoose.Schema({
    applyItem: String,
    applyName: String,
    applyPhone: String,
    status: String,
    time: String,
})

//生成的Model对象
var Model = {
    adminModel: db.model('admin', adminSchema, "admin"),
    userModel: db.model('user', userSchema, "user"),
    contactModel: db.model('contact', contactSchema, "contact"),
    promotionModel: db.model('promotion', promotionSchema, "promotion"),
    familyCaseModel: db.model('familyCase', familyCaseSchama, "familyCase"),
    imformationModel: db.model('imformation', imformationSchema, "imformation"),
    onlineDemoModel: db.model('onlineDemo', onlineDemoSchema, 'onlineDemo'),
    applyModel: db.model('apply', applySchema, 'apply'),
}

//用户登录
Model.login = function(req, callback) {
    Model.adminModel.findOne({userName: req.body.userName},function(err, data){
        console.log(data, "==========登录查询到的数据");
        if(err){
            console.log(err);
        }else{
            if(data == null){
                callback(401001);
            }else if(req.body.userPwd == data.userPwd){
                callback(200, {id: data._id , userName: data.userName, phone: data.phone});
            }else{
                callback(401002);
            }
        }
    })
}
//获取用户列表
Model.getUserList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.userModel.find().or([{userName: regExp}, {phone: regExp}]).select('-userPwd').exec(function(err, data){
        if(err) {
            console.log(err);
        } else {
            callback(200, data);
        }
    })
}
//联系我们
Model.contactUs = function(req, callback) {
    Model.contactModel.create(req.body, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200);
        }
    })
}

// 获取联系我们列表
Model.getContactList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.contactModel.find().or([{name: regExp}, {phone: regExp}, {advice: regExp}, {time: regExp}, {status: regExp}]).exec(function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, data);
        }
    })
}
// 处理联系我们
Model.contactAction = function(req, callback) {
    var status = req.body.status == '未处理' ? '未处理' : '已处理';
    Model.contactModel.update({_id: req.body.id}, {$set: {status: status}}, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, status);
        }
    })
}

//优惠活动
Model.getPromotionList = function(req, callback) {
    Model.promotionModel.find({}, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, data);
        }
    })
}

//家装案列
Model.getFamilyCaseList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.familyCaseModel.find().or([{title: regExp}, {description: regExp}]).exec(function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, data);
        }
    })
}
Model.editCaseItem = function(req, callback) {
}
Model.delCaseItem = function(req, callback) {
    Model.familyCaseModel.remove({_id: req.body.id}, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200);
        }
    })
}

//新闻资讯
Model.getImformationList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.imformationModel.find({}, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            var industryHot = [];
            var companyHot  = [];
            var otherHot    = [];
            data.map(function(obj) {
                if(obj.type == '行业新闻') {
                    industryHot.push(obj);
                }else if(obj.type == '公司新闻') {
                    companyHot.push(obj);
                }
            })
            Model.imformationModel.find().or([{title: regExp}, {time: regExp}, {desc: regExp}, {type: regExp}]).exec(function(err, newData) {
                if(err) {
                    console.log(err);
                }else{
                    newData.map(function(obj) {
                        if(obj.type == '其他') {
                            otherHot.push(obj);
                        }
                    });
                    var obj = {
                        industryHot: industryHot,
                        companyHot: companyHot,
                        otherHot: otherHot
                    }
                    callback(200, obj);
                }
            })
        }
    })
}

//装修效果图
Model.getOnlineDemoList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.onlineDemoModel.find().or([{title: regExp}, {space: regExp}, {part: regExp}, {style: regExp}]).exec(function(err, data) {
        if(err) {
            console.log(500);
        }else{
            callback(200, data);
        }
    })
}

// 获取申请列表
Model.getApplyList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.applyModel.find().or([{applyItem: regExp}, {applyName: regExp}, {applyPhone: regExp}, {applyStatus: regExp}]).exec(function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, data);
        }
    })
}
// 处理申请
Model.applyAction = function(req, callback) {
    var status = req.body.status == '未处理' ? '未处理' : '已处理';
    Model.applyModel.update({_id: req.body.id}, {$set: {status: status}}, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, status);
        }
    })
}
// 获取资讯列表
Model.getNewsList = function(req, callback) {
    var regExp = new RegExp(req.query.keyword);
    Model.imformationModel.find().or([{title: regExp}, {type: regExp}, {time: regExp}, {desc: regExp}]).exec(function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200, data);
        }
    })
}
Model.getNewsDetail = function(req, callback) {
    var params = {_id: req.query.id};
    console.log(params);
    Model.imformationModel.findOne(params, function(err, data) {
        console.log(data, '资讯详情====================');
        if(err) {
            console.log(err);CONTACT_ACTION
        } else {
            callback(200, data);
        }
    })
}
Model.updateNews = function(req, callback) {
    var params = req.body;
    Model.imformationModel.update({_id: params._id}, {$set: {title: params.title, content: params.content, type: params.type, desc: params.desc}}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            callback(200, data);
        }
    })
}
Model.getNewsDetail = function(req, callback) {
    Model.onlineDemoModel.findOne({_id: req.query.id}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            callback(200, data);
        }
    })
}

Model.addRender = function(req, callback) {
    Model.onlineDemoModel.create(req.body, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            callback(200, data);
        }
    })
}
Model.editRender = function(req, callback) {
    var params = req.body;
    Model.onlineDemoModel.update({_id: params._id}, {$set: {
        title: params.title,
        space: params.space,
        part: params.part,
        style: params.style,
        img: params.img,
    }}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            callback(200, data);
        }
    })
}
Model.delRender = function(req, callback) {
    Model.onlineDemoModel.remove({_id: req.body.id}, function(err, data) {
        if(err) {
            console.log(err);
        }else{
            callback(200);
        }
    })
}

module.exports = { Model };
