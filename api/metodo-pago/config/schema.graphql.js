const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
module.exports ={
  definition:`
      type PaymentMethodEdge{
          node: MetodoPago
          cursor: ID!
      }
      type PaymentMethodConnection{
          totalCount: Int!
          edges: [PaymentMethodEdge!]!
          pageInfo: PageInfo!
      }
  `,
  query:`
      paginationPaymentMethod(
          start: Int,
          limit: Int,
          card_number: Long,
          month: String,
          year:Long,
          cvc:Int,
          holder:String,
          invoice: Long,
          expedition_date:DateTime,
          admission_date:DateTime,
          description:String,
          reference:String,
          type:String,
          shopping_cost:Float,
          credits_limit:Long,
          username:String,
          sale_amount:Float
      ):PaymentMethodConnection
  `,
  resolver:{
      Query:{
          paginationPaymentMethod:
          async(obj,{start, limit, card_number, month, year, cvc, holder, invoice,expedition_date, admission_date, description, reference, type, shopping_cost, credits_limit, username, sale_amount},ctx) =>{
            const authorization = ['Administrator','User'];
            const authenticated = ctx.context.headers.authorization

            const token = await utils.authorization(authenticated.split(' ')[1], authorization);
            if(!token){
              throw new Error('No tienes autorización para realizar esta acción.');
            }
              const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
              const query = {
                ...(card_number && !isNaN(parseInt(card_number))) && {
                  numero_tarjeta: parseInt(card_number)
                },
                ...(month && {
                  mes: {
                    $regex: RegExp(month, 'i')
                  }
                }),
                ...(year && !isNaN(parseInt(year))) && {
                  anio: parseInt(year)
                },
                ...(cvc && !isNaN(parseInt(cvc))) && {
                  cvc: parseInt(cvc)
                },
                ...(holder && {
                  titular: {
                    $regex: RegExp(holder, 'i')
                  }
                }),
                ...(invoice && !isNaN(parseInt(invoice))) && {
                  folio: parseInt(invoice)
                },
                ...(expedition_date && {
                  fecha_expedicion: expedition_date
                }),
                ...(admission_date && {
                  fecha_ingreso: admission_date
                }),
                ...(description && {
                  descripcion: {
                    $regex: RegExp(description, 'i')
                  }
                }),
                ...(reference && {
                  referencia: {
                    $regex: RegExp(reference, 'i')
                  }
                }),
                ...(type && {
                  tipo: {
                    $regex: RegExp(type, 'i')
                  }
                }),
                ...(shopping_cost && !isNaN(parseFloat(shopping_cost))) && {
                  'compras.costo': parseFloat(shopping_cost)
                },
                ...(credits_limit  && !isNaN(parseInt(credits_limit ))) && {
                  'creditos.limite': parseInt(credits_limit )
                },
                ...(username && {
                  'usuario.nombre': {
                    $regex: RegExp(username, 'i')
                  }
                }),
                ...(sale_amount && !isNaN(parseFloat(sale_amount))) && {
                  'venta.monto': parseFloat(sale_amount )
                },
              };
              const paymentMethod = await strapi.query('metodo-pago').find(query);
              const {edges, pageInfo} = schema.search(paymentMethod,startIndex, limit)
              return {
                totalCount: paymentMethod.length,
                edges,
                pageInfo,
              };
          }
      }
  }

}
