const errorHandler = (err, req, res, next) => {
	console.log("Error Handler: ", err.name, err);

	let statusCode = err.status || 500;
	switch (err.name) {
		case "SequelizeValidationError":
			res.status(400).json({ message: err.errors[0].message });
			break;
		case "SequelizeUniqueConstraintError":
			res.status(400).json({ message: err.errors[0].message });
			break;
		case "SequelizeDatabaseError":
			res.status(400).json({ message: "Something Wrong On Database" });
			break;
		case "Username, Email and Password is required":
		case "Email already registered":
		case "Email and Password is required":
		case "Email is required":
		case "Username is required":
		case "Password is required":
		case "Invalid email/password":
		case "Invalid token":
		case "Product not found":
		case "Theres nothing to update":
		case "Forbidden access":
		case "Your dont have permission":
			res.status(statusCode).json({ message: err.name });
		default:
			res.status(statusCode).json({ message: "Internal Server Error" });
			break;
	}
};

module.exports = errorHandler;
