var getMyProfile = function(req, res){
	res.json({
		my_profile : true,
		info : req.user.acc
	});
};

module.exports.getMyProfile = getMyProfile;