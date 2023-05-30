/*
    Name: findAvailableSeats
    Input : connection object of the database,category
    output: Number of seats yet to be booked in a particular category.
    Functionality :finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeats(con,category,round) {
    var availableSeats=0;
    var availablePWDSeats=[{SeatsAllocated:0,seatsTaken:0}];
    /*
    querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
    try {
        [availableSeats]=await con.query(`select SeatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' or accepted='R') and offercat='${category}') 
        as SeatsTaken from seatmatrix where category='${category}';`);
        [availablePWDSeats]=await con.query(`select SeatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' or accepted='R' or OfferedRound='${round}') and offercat='${category+'_PWD'}') 
        as SeatsTaken from seatmatrix where category='${category+'_PWD'}';`);
        // console.log(availablePWDSeats);
    } catch (error) {
        throw error;
    }
    var seatsAvailable=availablePWDSeats[0].SeatsAllocated-availablePWDSeats[0].SeatsTaken+Math.max(0,availableSeats[0].SeatsAllocated-availableSeats[0].SeatsTaken)
    console.log("Seats available for\t",category,"\tis:\t",seatsAvailable);
    //returning the value(seats allocated - seats booked (accepted+rejeted))
    return seatsAvailable;
}
/*
    Name: findAvailableSeats
    Input : connection object of the database,category
    output: Number of seats yet to be booked in a particular category.
    Functionality :finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeatsPWD(con,category,round) {
    var availableSeats=0;
    /*
    querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
    try {
        [availableSeats]=await con.query(`select SeatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' or accepted='R') and offercat='${category}') 
        as SeatsTaken from seatmatrix where category='${category}';`);
        // console.log(availableSeats)
    } catch (error) {
        throw error;
    }
    console.log("Seats available for\t",category,"\tis:\t",Math.max(0,availableSeats[0].SeatsAllocated-availableSeats[0].SeatsTaken));
    //returning the value(seats allocated - seats booked (accepted+rejeted))
    return Math.max(0,availableSeats[0].SeatsAllocated-availableSeats[0].SeatsTaken);
}
async function findAvailableSeatsCommonPWD(con,round) {
    var availableSeats=0;
    /*
    querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
    try {
        [availableSeats]=await con.query(`select SeatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' or accepted='R') and offercat REGEXP 'PWD$')
        as SeatsTaken from seatmatrix where category REGEXP 'COMMON_PWD';`);
        // console.log(availableSeats)
    } catch (error) {
        throw error;
    }
    console.log("Seats available for\t","common_PWD","\tis:\t",Math.max(0,availableSeats[0].SeatsAllocated-availableSeats[0].SeatsTaken));
    //returning the value(seats allocated - seats booked (accepted+rejeted))
    return Math.max(0,availableSeats[0].SeatsAllocated-availableSeats[0].SeatsTaken);
}
/*
    Name: findAvailableSeats
    Input : connection object of the database,category
    output: Number of seats yet to be booked in a particular category.
    Functionality :finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeatsGeneral(con,category,round) {
    var availableSeats=0;
    var availablePWDSeats=[{SeatsAllocated:0,seatsTaken:0}];
    /*
    querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
    try {
        [availableSeats]=await con.query(`select SeatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' ) and offercat='${category}') 
        as SeatsTaken from seatmatrix where category='${category}';`);
        [availablePWDSeats]=await con.query(`select SeatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' or accepted='R' or OfferedRound='${round}') and offercat='${category+'_PWD'}') 
        as SeatsTaken from seatmatrix where category='${category+'_PWD'}';`);
        // console.log(availablePWDSeats);
    } catch (error) {
        throw error;
    }
    var seatsAvailable=availablePWDSeats[0].SeatsAllocated-availablePWDSeats[0].SeatsTaken+Math.max(0,availableSeats[0].SeatsAllocated-availableSeats[0].SeatsTaken)
    console.log("Seats available for\t",category,"\tis:\t",seatsAvailable);
    //returning the value(seats allocated - seats booked (accepted+rejeted))
    return seatsAvailable;
}

module.exports={findAvailableSeats,findAvailableSeatsPWD,findAvailableSeatsCommonPWD,findAvailableSeatsGeneral}