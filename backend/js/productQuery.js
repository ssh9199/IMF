const pool = require('./pool');
const {DB_SELECT_ERROR, DB_INSERT_ERROR, DB_UPDATE_ERROR} = require('./terms');const INSERT_PRODUCT_QUERY = 'INSERT INTO Products (title, price, description, category, stock, tradeType, accessValue, sellerId, imagePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';


const selectProductByProductId = async (id) => {
    try {
        const [row] = await pool.execute(`SELECT * from Products WHERE id=${id}`);
        return row;
    } catch (err) {
        console.log(err)
        throw new Error(DB_SELECT_ERROR);
    }
}

const insertProduct = async (body) => {
    try {
        console.log(body)
        const result = await pool.execute(INSERT_PRODUCT_QUERY, [body.title, body.price, body.description, body.category, body.stock, body.tradeType, body.accessValue, body.sellerId, " "]);
        console.log(result[0][0]);
        if (result[0].affectedRows === 0) {
            console.log("INSERT_FAILED(NOT_AFFECTED)");
            throw new Error(DB_INSERT_ERROR);
        }
        if (result[0].affectedRows === 1) {
            console.log(result);
            console.log("INSERT_SUCCESS!");
            console.log("result:", result[0].insertId);
            const row  = await selectProductByProductId(result[0].insertId);
            console.log("row[0]:", row[0]);
            return (row[0]);
        }
    } catch (err) {
        console.log(err);
        console.log("INSERT_FAILED");
        throw new Error(DB_INSERT_ERROR);
    }
}

module.exports = {
    insertProduct
}