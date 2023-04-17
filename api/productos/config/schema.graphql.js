module.exports = {
  definition: `
    type ProductEdge{
        node: Productos
        cursor: ID!
    }
    type ProductConnection{
        totalCount: Int!
        edges: [ProductEdge!]!
        pageInfo: PageInfo!
    }
  `,
  query: `
     paginationProduct(
        start: Int!,
        limit: Int!,
        nombre: String,
        peso_neto: Float,
        presentacion: String
        marca: String,
        descripcion_generica: String,
        precio: Float,
        costo: Float,
        inventario_disp: Long,
        value_min: Int,
        codigo_barras: Long,
        codigo_interno: Long,
        venta_gramos: Float,
        status: Boolean,
        carritos_cantidad: Float,
        dimension_nombre: String,
        promociones_fecha_creacion: DateTime,
        proveedor_nombre: String,
        lotes_codigo_interno: Long,
     ): ProductConnection
  `,
  resolver: {
    Query: {
      paginationProduct : async (obj, {start, limit,
        nombre,//nombre2
        peso_neto,//peso_neto2
        presentacion,//presentacion2
        marca ,//marca2
        descripcion_generica,//descripcion_generica2
        precio,//precio2
        costo,//costo2
        inventario_disp,//inventario_disp2
        value_min,//value_min2
        codigo_barras,//codigo_barras2
        codigo_interno,//codigo_interno2
        venta_gramos,//venta_gramos2
        status,//status2
        carritos_cantidad,//carritos_cantidad2
        dimension_nombre,//dimension_nombre2
        promociones,//promociones2
        proveedor,//proveedor2
        lotes,//lotes2
      }) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(nombre && {
            nombre2: {
              $regex: RegExp(nombre, 'i')
            }
          }),
          ...(peso_neto && !isNaN(parseFloat(peso_neto))) && {
            peso_neto2: parseFloat(peso_neto)
          },
          ...(presentacion && {
            presentacion2:{
              $regex: RegExp(presentacion, 'i')
            }
          }),
          ...(marca && {
            marca2:{
              $regex: RegExp(marca, 'i')
            }
          }),
          ...(descripcion_generica && {
            descripcion_generica2:{
              $regex: RegExp(descripcion_generica, 'i')
            }
          }),
          ...(precio && !isNaN(parseFloat(precio))) && {
            precio2: parseFloat(precio)
          },
          ...(costo && !isNaN(parseFloat(costo))) && {
            costo2: parseFloat(costo)
          },
          ...(inventario_disp && !isNaN(parseInt(inventario_disp))) && {
            inventario_disp2: parseFloat(inventario_disp)
          },
          ...(value_min&& !isNaN(parseInt(value_min))) && {
            value_min2: parseFloat(value_min)
          },
          ...(codigo_barras&& !isNaN(parseInt(codigo_barras))) && {
            codigo_barras2: parseFloat(codigo_barras)
          },
          ...(codigo_interno&& !isNaN(parseInt(codigo_barras))) && {
            codigo_barras2: parseFloat(codigo_barras)
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
