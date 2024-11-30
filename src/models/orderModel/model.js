const GET = `
    select o.id , p.product_name , u.user_name , p.product_img  from orders o inner join products p on p.id = o.id inner join users u on u.id = o.user_id ;
`   

const POST = `
insert into orders( product_id , user_id) values ($1, $2)
RETURNING *
`
const GET_ORDER_BY_USER =  `
    select o.id as order_id, o.user_id as user_id, p.product_name, p.product_price , p.id as product_id from orders o LEFT JOIN users u ON u.id=o.id LEFT JOIN products p ON o.product_id=p.id WHERE o.user_id=$1;
`


const DELETE = `
    delete from orders where id = $1
`

module.exports = {
    GET,
    POST,
    DELETE,
    GET_ORDER_BY_USER
}