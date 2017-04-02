module.exports = function (sequelize, DataTypes){
    var usuario = sequelize.define('usuario',{
        'nome': DataTypes.STRING,
        'agencia': DataTypes.INTEGER,
        'conta': DataTypes.INTEGER,
        'valor':DataTypes.DOUBLE    

    });

    return usuario;

}
