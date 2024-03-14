function launchRocket(distance, angle, r, b, g, type, rocketArray, timeControler, speed,x,y) {
    let canvas = document.getElementById("mainstage");
    //console.log("Launching a " + type + " rocket, with colors " + r + "," + b + "," + g + " with distance " + distance + " at angle " + angle + ", startime: " + timeControler.getTime());
    var rocketObject = {
        type: type,
        distance: distance,
        angle: angle,
        offAngle: Math.round(Math.random() * 45 + 0),
        x: x ? x : canvas.width / 2,
        y: y ? y : canvas.height /2,
        speed: speed,
        red: r,
        blue: b,
        green: g,
        fadeout: 1,
        wave: 0,
        launchTime: timeControler.getTime(),
        done: "no",
    };
    rocketArray.push(rocketObject);
}

function launchRandomRocket(rocketArray, timeControler, y, x) {
    var rocketType = ["regular", "sphere"];
    var speed = (Math.round(Math.random() * 5 + 2));
    var randomRocket = (Math.round(Math.random() * 1 + 0));
    var red = (Math.round(Math.random() * 255 + 0));
    var blue = (Math.round(Math.random() * 255 + 0));
    var randomAngle = (Math.round(Math.random() * 360 + 0));
    var distance = (Math.round(Math.random() * 25 + 30));
    //randomAngle = randomAngle * TO_RADIANS;
    var green = (Math.round(Math.random() * 255 + 0))
    launchRocket(distance, randomAngle, red, blue, green, rocketType[randomRocket], rocketArray, timeControler, speed, x, y);
}

function rocketFlightPath(rocket, timeControler, rocketArray) {
    let TO_RADIANS = Math.PI / 180;
    let canvas = document.getElementById("mainstage");
    let ctx = canvas.getContext("2d");
    if (rocket.type === "sphere") {
        if (rocket.launchTime + 1000 > timeControler.getTime()) {
            for (y = 0; y < 5; y++) {
                ctx.beginPath();
                var filter = 0.1 * y;
                //console.log(filter);
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + filter + ')';
                var rocketX = rocket.x;
                var rocketY = rocket.y;
                rocketX += Math.round((0 + (5 - y)) * Math.sin(rocket.angle * TO_RADIANS));
                rocketY -= Math.round((0 + (5 - y)) * Math.cos(rocket.angle * TO_RADIANS));
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
            rocket.x += Math.round((0 - (rocket.speed)) * Math.sin(rocket.angle * TO_RADIANS));
            rocket.y -= Math.round((0 - (rocket.speed)) * Math.cos(rocket.angle * TO_RADIANS));
            //console.log("sphere rising");
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.9 + ')';
            ctx.arc(rocket.x, rocket.y, 1, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.5 + ')';
            ctx.arc(rocket.x, rocket.y, 3, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.2 + ')';
            ctx.arc(rocket.x, rocket.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if (rocket.launchTime + 1000 <= timeControler.getTime() && rocket.launchTime + 1500 > timeControler.getTime()) {
            //console.log("sphere shooting out and growing!");
            for (i = 1; i < 9; i++) {
                var newAngle = rocket.offAngle + (45 * i);
                //console.log(newAngle);
                var rocketX = rocket.x;
                var rocketY = rocket.y;
                rocketX += Math.round((0 - (rocket.wave)) * Math.sin(newAngle * TO_RADIANS));
                rocketY -= Math.round((0 - (rocket.wave)) * Math.cos(newAngle * TO_RADIANS));
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.1 + ')';
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.4 + ')';
                ctx.arc(rocketX, rocketY, 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.9 + ')';
                ctx.arc(rocketX, rocketY, 6, 0, 2 * Math.PI);
                ctx.stroke();
            }
            rocket.wave = rocket.wave + 2;
        }
        else if (rocket.launchTime + 1500 <= timeControler.getTime() && rocket.launchTime + 2000 > timeControler.getTime()) {
            for (i = 1; i < 9; i++) {
                var newAngle = rocket.offAngle + (45 * i);
                //console.log(newAngle);
                var rocketX = rocket.x;
                var rocketY = rocket.y;
                rocketX += Math.round((0 - (rocket.wave)) * Math.sin(newAngle * TO_RADIANS));
                rocketY -= Math.round((0 - (rocket.wave)) * Math.cos(newAngle * TO_RADIANS));
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + rocket.fadeout + ')';
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + rocket.fadeout + ')';
                ctx.arc(rocketX, rocketY, 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + rocket.fadeout + ')';
                ctx.arc(rocketX, rocketY, 6, 0, 2 * Math.PI);
                ctx.stroke();
            }
            rocket.wave = rocket.wave + 2;
            rocket.fadeout = rocket.fadeout - 0.05;
            //console.log("sphere shooting out and fading!");
        }
        else {
            rocket.done = "yes"
            //console.log("sphere dead");
        }
    }
    else if (rocket.type === "regular") {
        if (rocket.launchTime + 1000 > timeControler.getTime()) {
            rocket.x += Math.round((0 - (rocket.speed)) * Math.sin(rocket.angle * TO_RADIANS));
            rocket.y -= Math.round((0 - (rocket.speed)) * Math.cos(rocket.angle * TO_RADIANS));
            //console.log("sphere rising");
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.9 + ')';
            ctx.arc(rocket.x, rocket.y, 1, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.5 + ')';
            ctx.arc(rocket.x, rocket.y, 3, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.2 + ')';
            ctx.arc(rocket.x, rocket.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if (rocket.launchTime + 1000 <= timeControler.getTime() && rocket.launchTime + 1300 > timeControler.getTime()) {
            //console.log("regular shooting out!");
            for (i = 1; i < 9; i++) {
                var newAngle = Math.round(Math.random() * 45 + 0) + 45 * i;
                //console.log(newAngle);
                var rocketX = rocket.x;
                var rocketY = rocket.y;
                rocketX += Math.round((0 - (rocket.wave)) * Math.sin(newAngle * TO_RADIANS));
                rocketY -= Math.round((0 - (rocket.wave)) * Math.cos(newAngle * TO_RADIANS));
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.1 + ')';
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
                rocketX += Math.round((0 - (rocket.wave + 1)) * Math.sin(newAngle * TO_RADIANS));
                rocketY -= Math.round((0 - (rocket.wave + 1)) * Math.cos(newAngle * TO_RADIANS));
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + 0.4 + ')';
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
            rocket.wave = rocket.wave + 1;
            rocket.red = rocket.red + 10;
            rocket.green = rocket.green + 10;
            rocket.blue = rocket.blue + 10;
        }
        else if (rocket.launchTime + 1300 <= timeControler.getTime() && rocket.launchTime + 2000 > timeControler.getTime()) {
            //console.log("regular shooting fades!");
            for (i = 1; i < 9; i++) {
                var newAngle = Math.round(Math.random() * 45 + 0) + 45 * i;
                //console.log(newAngle);
                var rocketX = rocket.x;
                var rocketY = rocket.y;
                rocketX += Math.round((0 - (rocket.wave)) * Math.sin(newAngle * TO_RADIANS));
                rocketY -= Math.round((0 - (rocket.wave)) * Math.cos(newAngle * TO_RADIANS));
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + rocket.fadeout + ')';
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
                rocketX += Math.round((0 - (rocket.wave + 1)) * Math.sin(newAngle * TO_RADIANS));
                rocketY -= Math.round((0 - (rocket.wave + 1)) * Math.cos(newAngle * TO_RADIANS));
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(' + rocket.red + ',' + rocket.green + ',' + rocket.blue + ',' + rocket.fadeout + ')';
                ctx.arc(rocketX, rocketY, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
            rocket.wave = rocket.wave + 1;
            rocket.fadeout = rocket.fadeout - 0.05;
        }
        else {
            //rocket.done = "yes";
            //console.log("regular dead");
        }
    }
}