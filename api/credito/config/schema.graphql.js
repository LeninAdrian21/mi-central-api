const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
module.exports = {
    definition:`
        type credenceEdge{
            node: Credito
            cursor: ID!
        }
        type credenceConnection{
            totalCount: Int!
            edges: [credenceEdge!]!
            pageInfo: PageInfo!
        }

    `,
    query:`
        paginationcredit(
            start: Int,
            limit: Int,
            end: Float,
            high_date: DateTime,
            low_date: DateTime,
            validity: DateTime,
            interests: Float,
            status: Boolean,
            status2: String,
            payments: Float,
            payment_method : Float,
            user: String
        ):credenceConnection
    `,
    // limite = end
    // fecha_alta =high_date
    // fecha_baja =low_date
    // vigencia = validity
    // intereses = interests
    // abonos = payments
    // metodo_pago = payment_method
    // usuario = user
    resolver:{
        Query: {
            paginationcredit:
                async(obj,{start,limit,end,high_date,low_date,validity,interests,status,status2,payments,payment_method ,user}, ctx) =>{
                  const authorization = ['Administrator','User'];
                  const authenticated = ctx.context.headers.authorization

                  const token = await utils.authorization(authenticated.split(' ')[1], authorization);
                  if(!token){
                    throw new Error('No tienes autorización para realizar esta acción.');
                  }
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query = {
                        mostrar:true,
                        ...(end &&!isNaN(parseFloat(end)) && {
                          limite: parseFloat(end)
                        }),
                        ...(high_date && {
                            fecha_alta: high_date
                        }),
                        ...(low_date && {
                            fecha_baja: low_date
                        }),
                        ...(validity && {
                            vigencia: validity
                        }),
                        ...(interests && !isNaN(parseFloat(interests)))&& {
                            intereses: parseFloat(interests)
                        },
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(status2 && {
                            status2: new RegExp(status2,'i')
                        }),
                        ...(payments &&!isNaN(parseFloat(payments)) && {
                            "abonos.cantidad_abono": parseFloat(payments)
                        }),
                        ...(payment_method  &&!isNaN(parseFloat(payment_method )) && {
                            "metodo_pago.numero_tarjeta": parseFloat(payment_method )
                         }),
                        ...(user && {
                            "usuario.nombre": new RegExp(user, 'i')
                        }),

                    };
                    const credit = await strapi.query('credito').find(query);
                    const {edges, pageInfo} = schema.search(credit,startIndex, limit)
                    return {
                      totalCount: credit.length,
                      edges,
                      pageInfo,
                    };

                }
        }
    }
}


