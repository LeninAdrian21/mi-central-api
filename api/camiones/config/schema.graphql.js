// type PageInfoc{
//     startCursor: ID
//     endCursor: ID
//     hasNextPage: Boolean!
//     hasPreviousPage: Boolean!
// }
module.exports = {
    definition: `
    type CamionEdge{
        node: Camiones
        cursor: ID!
    }
    type CamionConnection{
        totalCount: Int!
        edges: [CamionEdge!]!
        pageInfo: PageInfo!
    }
    `,
    query:`
     paginationCamiones(
        start: Int,
        limit: Int,
        placa: String,
        estado: String,
        placa_activa: Boolean,
        num_serie: String,
        niv: String,
        fecha_inicio: Date,
        fecha_fin: Date,
        destino: String,
        conductor: String,
        gastos: String
     ): CamionConnection
    `,
    resolver: {
        Query: {
            paginationCamiones:
              async (obj, {start,limit,placa,estado,placa_activa,num_serie,niv,fecha_inicio,fecha_fin,destino,conductor,gastos}) => {
                const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                const query = {
                  placas:{
                    $elemMatch:{
                      placa:{
                        $regex: new RegExp(placa, 'i')
                      }
                    }
                  }
                }
                if(placa){
                    const regex = new RegExp(placa, 'i')
                    query['placas'] = {
                      $elemMatch:{
                        placa:{
                          $regex: regex
                        }
                      }
                    }
                  }
                if(estado){
                    const regex = new RegExp(estado, 'i')
                    query['placas'] = {
                      $elemMatch:{
                        estado:{
                          $regex: regex
                        }
                      }
                    }
                  }
                if(placa_activa){
                    const regex = new RegExp(placa_activa, 'i')
                    query['placas'] = {
                      $elemMatch:{
                        activa:{
                          $regex: regex
                        }
                      }
                    }
                }
                if(num_serie){
                    const regex = new RegExp(num_serie, 'i');
                    query.num_serie = { $regex: regex };
                }
                if(niv){
                    const regex = new RegExp(niv, 'i');
                    query.niv = { $regex: regex };
                }
                if(destino){
                    const regex = new RegExp(destino, 'i');
                    query["rutas.destino"] = { $regex: regex };
                }
                if(conductor){
                    const regex = new RegExp(conductor, 'i');
                    query["usuario.nombre"] = { $regex: regex };
                }
                if(gastos){
                    const regex = new RegExp(gastos, 'i');
                    query["gastos.categoria"] = { $regex: regex };
                }
                const camiones = await strapi.query('camiones').find(query);
                const edges = camiones
                .slice(startIndex, startIndex + parseInt(limit))
                .map((camion) => ({ node: camion, cursor: camion.id }));
              const pageInfo = {
                startCursor: edges.length > 0 ? edges[0].cursor : null,
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                hasNextPage:  startIndex + parseInt(limit) < camiones.length,
                hasPreviousPage: startIndex > 0,
              };
              return {
                totalCount: camiones.length,
                edges,
                pageInfo,
              };

              }
        }
    }



}
