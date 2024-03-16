async function findAvailableSeats(con, category, round, branch) {
  var availableSeats = 0;
  var availablePWDSeats = [{ SeatsAllocated: 0, seatsTaken: 0 }];

  try {
    [availableSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat='${category}') 
        AS SeatsTaken FROM seatmatrix WHERE category='${category}' AND branch='${branch}';`);

    [availablePWDSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R' OR OfferedRound='${round}') AND offercat='${
      category + "_PWD"
    }') 
        AS SeatsTaken FROM seatmatrix WHERE category='${
          category + "_PWD"
        }' AND branch='${branch}';`);
  } catch (error) {
    throw error;
  }

  var seatsAvailable =
    availablePWDSeats[0].SeatsAllocated -
    availablePWDSeats[0].SeatsTaken +
    Math.max(
      0,
      availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
    );
  console.log("Seats available for\t", category, "\tis:\t", seatsAvailable);
  return seatsAvailable;
}

async function findAvailableSeatsPWD(con, category, round, branch) {
  var availableSeats = 0;

  try {
    [availableSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat='${category}') 
        AS SeatsTaken FROM seatmatrix WHERE category='${category}' AND branch='${branch}';`);
  } catch (error) {
    throw error;
  }

  console.log(
    "Seats available for\t",
    category,
    "\tis:\t",
    Math.max(0, availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken)
  );
  return Math.max(
    0,
    availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
  );
}

async function findAvailableSeatsCommonPWD(con, round, branch) {
  var availableSeats = 0;

  try {
    [availableSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat REGEXP 'PWD$')
        AS SeatsTaken FROM seatmatrix WHERE category REGEXP 'COMMON_PWD' AND branch='${branch}';`);
  } catch (error) {
    throw error;
  }

  console.log(
    "Seats available for\t",
    "common_PWD",
    "\tis:\t",
    Math.max(0, availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken)
  );
  return Math.max(
    0,
    availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
  );
}

async function findAvailableSeatsGeneral(con, category, round, branch) {
  var availableSeats = 0;
  var availablePWDSeats = [{ SeatsAllocated: 0, seatsTaken: 0 }];

  try {
    [availableSeats] = await con.query(
      `SELECT SeatsAllocated FROM seatmatrix WHERE category='${category}' AND branch='${branch}';`
    );

    [availablePWDSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R' OR OfferedRound='${round}') AND offercat='${
      category + "_PWD"
    }') 
        AS SeatsTaken FROM seatmatrix WHERE category='${
          category + "_PWD"
        }' AND branch='${branch}';`);
  } catch (error) {
    throw error;
  }

  var seatsAvailable =
    availablePWDSeats[0].SeatsAllocated -
    availablePWDSeats[0].SeatsTaken +
    Math.max(0, availableSeats[0].SeatsAllocated);
  console.log("Seats available for\t", category, "\tis:\t", seatsAvailable);
  return Math.max(0, seatsAvailable);
}

module.exports = {
  findAvailableSeats,
  findAvailableSeatsPWD,
  findAvailableSeatsCommonPWD,
  findAvailableSeatsGeneral,
};
