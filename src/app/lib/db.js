const {DB_USERNAME, DB_PASS, DB_NAME} = process.env

export const connectionStr = "mongodb+srv://"+DB_USERNAME+":"+DB_PASS+"@cluster0.gnybkdy.mongodb.net/"+DB_NAME+"?retryWrites=true&w=majority&appName=Cluster0"