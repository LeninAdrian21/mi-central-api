module.exports = {
  definition: `
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
  query: `
     paginationPaymentMethod(
        start: Int!,
        limit: Int!,
        card_number: Long,
        month: String,
        year:Long,
        cvc:Int,
        holder:String,
        invoice:Long,
        expedition_date:DateTime,
        admission_date:Date,
        description:String,
        reference:String,
        type:String,
        shopping_cost:Float,
        credits_limit:Long,
        username:String,
        sale_amount:Float
     ): PaymentMethodConnection
  `,
  resolver: {
    Query: {
      paginationPaymentMethod: async (obj, {start, limit, card_number, month, year, cvc, holder, invoice,expedition_date, admission_date, description, reference, type, shopping_cost, credits_limit, username, sale_amount}) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
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
            cvc2: parseInt(cvc)
          },
          ...(holder && {
            titular: {
              $regex: RegExp(holder, 'i')
            }
          }),
          ...(invoice && isNaN(parseInt(invoice))) && {
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
          ...(shopping_cost && isNaN(parseFloat(shopping_cost))) && {
            'compras.costo': parseFloat(shopping_cost)
          },
          ...(credits_limit && isNaN(parseInt(credits_limit))) && {
            'creditos.limite': parseInt(credits_limit)
          },
          ...(username && {
            'usuario.nombre': {
              $regex: RegExp(username, 'i')
            }
          }),
          ...(sale_amount && isNaN(parseFloat(sale_amount))) && {
            'venta.monto': parseFloat(sale_amount)
          },
        };
        const PaymentMethods = await strapi.query('metodo-pago').find(query);
        const edges = PaymentMethods
          .slice(startIndex, startIndex + parseInt(limit))
          .map((PaymentMethod) => ({
            node: PaymentMethod,
            cursor: PaymentMethod.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < PaymentMethods.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: PaymentMethods.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}
