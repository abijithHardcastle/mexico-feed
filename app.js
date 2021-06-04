const data = require('./data.json');
const client = require('./database');
const rand = require('random-key');
const fs = require('fs/promises');
const xml2json = require('xml2js');

const parser = new xml2json.Parser();

client.connect().then(() => {
    console.log('db connected');
    readFile();
});

function readFile () {
    fs.readFile('./properties_cellahome (1).xml', {encoding: 'latin1'}).then((file)=>{
        parser.parseStringPromise(file)
        .then(jsondata => {
            insertDB(jsondata.properties_rw.property);
        })
    })
}

async function insertDB(property){
    property.forEach((element)=>{
        var media = JSON.stringify(element.photos);
        client.query(`INSERT INTO listings_mexico(locationpoint,
            listingkey, media, listprice, currencytype, bedroomstotal, bathroomstotal,  lotsizeacres,
            frontdimension, buildingdimension, stories, 
            propertytype, postalcode, listingtitle, 
            brokername, officeid, officeaddress, officecity, officepostalcode, officephone, officeemail,
            unparsedaddress,  transactiontype, details, description, builtin, state, city, 
            modificationtimestamp, created_date, publicarea, officearea, warehousearea, parkingarea,
            manoeuvringarea, fullbaths, sector, landuse ) VALUES(
                ST_SetSRID(ST_GeomFromText('POINT(${element.location[0].longitude[0]} ${element.location[0].latitude[0]})'), 4326),
                '${element['$'].id}',
                '${media}',
                ${parseFloat(element.price[0]._)}, '${element.price[0]['$'].currency}',
                ${element.bedrooms ? element.bedrooms[0] != '' ? parseInt(element.bedrooms[0]) : 0 : 0}, ${element.partial_baths ? element.partial_baths[0] != '' ? parseInt(element.partial_baths[0]) : 0 : 0},
                ${element.property_dimension ? element.property_dimension[0] != '' ? parseFloat(element.property_dimension[0]) : 0 : 0}, ${element.front_dimension ? element.front_dimension[0] != '' ? parseFloat(element.front_dimension[0]) : 0 : 0},
                ${element.building_dimension ? element.building_dimension[0] != '' ? parseFloat(element.building_dimension[0]) : 0 : 0}, ${element.floors ? element.floors[0] != '' ? parseInt(element.floors[0]): 0 : 0},
                '${element.type ? element.type[0] : ""}', '${element.location[0].postal_code ? element.location[0].postal_code[0] : ""}', '${element.title ? element.title[0] : ""}',
                '${element.office[0].franchises ? element.office[0].franchises[0].trim() : ""}', '${element.office ? element.office[0]['$'].id : ""}', '${element.office[0].office_address1 ? element.office[0].office_address1[0] : ""}',
                '${element.office[0].city_office ? element.office[0].city_office[0]: ""}', '${element.office[0].postal_code_office ? element.office[0].postal_code_office[0] : ""}',
                '${element.office[0].phone ? element.office[0].phone[0]: ""}', '${element.office[0].contact_email ? element.office[0].contact_email[0] : ""}',
                '${element.location[0].zone ? element.location[0].zone[0]: "" + " " + element.location[0].suburb ? element.location[0].suburb[0] : "" + " " + element.location[0].postal_code ? element.location[0].postal_code[0]: ""}',
                '${element.operation ? element.operation[0]: ""}', '${element.details ? JSON.stringify(element.details[0].trim()).replace(/'/g, " ") : ""}', '${element.description ? JSON.stringify(element.description[0].trim()).replace(/'/g, " ") : ""}',
                '${element.age ? element.age : ""}', '${element.location.state ? element.location.state : ""}', '${element.location.municipality ? element.location.municipality: ""}',
                '${element.updated_at ? element.updated_at[0]: ""}', '${element.created_at ? element.created_at[0] : ""}', 
                ${element.public_area ? element.public_area[0] != '' ? parseFloat(element.public_area[0]) : 0 : 0}, ${element.office_area ? element.office_area[0] != '' ? parseFloat(element.office_area[0]) : 0 : 0}, 
                ${element.warehouse_area ? element.warehouse_area[0] != '' ? parseFloat(element.warehouse_area[0]) : 0 : 0}, ${element.parking_area ? element.parking_area[0] != '' ? parseFloat(element.parking_area[0]) : 0 : 0}, 
                ${element.manoeuvring_area ? element.manoeuvring_area[0] != '' ? parseFloat(element.manoeuvring_area[0]) : 0 : 0}, ${element.full_baths ? element.full_baths[0] != '' ? parseInt(element.full_baths[0]) : 0 : 0}, 
                '${element.sector ? element.sector[0] : ""}', '${element.land_use ? element.land_use[0] : ""}'
                );`, (err, result)=>{
                    if(err) {
                        console.log(err.stack);
                    }
                }
            )
        
    })
        
};

