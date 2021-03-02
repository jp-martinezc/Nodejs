var http = require('http');
var url = require('url');
var fs = require('fs');
const axios = require('axios').default

var neededstats = [];

http.createServer(function (req, res) {

    var path = req.url;
    evaluateURL(path);

    var endP = () => {
        fs.readFile("./index.html", 'utf8', (err, data) => {
            res.end(data);
        });
    }

    function evaluateURL(path) {
        try {
            switch (path) {
                case '/api/proveedores':
                    axios.get("https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json")
                        .then((data) => {
                            setTable(data.data, 'idproveedor', 'nombrecompania', 'nombrecontacto','Proveedores');
                            endP();
                        }, (error) => {
                            console.log(error);
                        });
                    break;
                case '/api/clientes':
                    axios.get("https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json")
                        .then((data) => {
                            setTable(data.data, 'idCliente', 'NombreCompania', 'NombreContacto','Clientes');
                            endP();
                        }, (error) => {
                            console.log(error);
                        });
                    break;
                default:
                    fs.writeFile("./index.html", "<h1>Ruta no conocida</h1>", (err) => {
                        if (err)
                            console.warn(err)
                            endP();
                    });
                    break;
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    function setTable(data, type, cia, contac, tipo) {
        if (data != null) {
            try { 
                var head = '<!DOCTYPE html>\n\
    <html lang="en">\n\
        <head>\n\
            <title>Information List</title>\n\
            <meta charset="utf-8">\n\
            <meta name="viewport" content="width=device-width, initial-scale=1">\n\
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">\n\
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>\n\
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>\n\
        </head>\n\
        <body>\n\
            <div class="container">\n\
            <h2>' + tipo + '</h2>\n\
            <table class="table table-striped">\n\
            <thead>\n\
                <tr>\n\
                <th>ID</th>\n\
                <th>Nombre cia</th>\n\
                <th>Nombre contacto</th>\n\
                </tr>\n \
            </thead>\n \
            <tbody></tbody>\n';

                var dat;

                for (let i in data) {
                    var row = "<tr>\n\t\t\t<td>" + data[i][type] + "</td>\n\t\t\t<td>" + data[i][cia] + "</td><td>" + data[i][contac] + "</td></tr>"
                    dat += row
                }

                var foot = '</tbody> \n\
    </table>\n\
    </div>\n\
    </body>\n\
    </html>';

                var info = head.concat(dat).concat(foot)

                fs.writeFile("./index.html", info, (err) => {
                    if (err)
                        console.warn(err)
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    }

}).listen(8080, '0.0.0.0');


console.log('Server running.');