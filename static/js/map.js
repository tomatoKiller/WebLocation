$(document).ready(function(){

	var obj = new MakeMap({
		mapId : "#svg",
		mapViewId : "div#mapview",
		mapDivId : "div#mapdiv"
	});

	// $("#svg").width( $("div#mapdiv").width() );
	// $("#svg").height( $("div#mapdiv").height() );
	
	// $("div#mapview").mousewheel(function (event, delta, deltaX, deltaY) {
	// 	var factor = delta > 0 ? -0.1 : 0.1;

	// 	var mapDivLeft = parseInt( $("div#mapdiv").css("left") );
	// 	var mapDivTop = parseInt( $("div#mapdiv").css("top") );
		
	// 	var xDist = event.clientX - mapDivLeft;
	// 	var yDist = event.clientY - mapDivTop;

	// 	// alert("hhhhhhhhh");
	// 	$("div#mapdiv").width( $("div#mapdiv").width() * (1 + factor) );
	// 	$("div#mapdiv").height( $("div#mapdiv").height() * (1 + factor) );

	// 	$("div#mapdiv").css("left", mapDivLeft - xDist * factor + "px");
	// 	$("div#mapdiv").css("top", mapDivTop - yDist * factor + "px");

	// 	$("#svg").width( $("div#mapdiv").width() );
	// 	$("#svg").height( $("div#mapdiv").height() );
	// });



});

/*
 param {
	mapviewId, mapdivId, mapId
 }


*/

function MakeMap (param) {

	var m = this;

	m.map = $(param.mapId);
	m.mapView = $(param.mapViewId);
	m.mapDiv = $(param.mapDivId);

	$(param.mapId).width( $(param.mapDivId).width() );
	$(param.mapId).height( $(param.mapDivId).height() );

	m.mapDiv.mousewheel(function (event, delta, deltaX, deltaY) {
		var factor = delta > 0 ? -0.1 : 0.1;

		var mapDivLeft = parseInt( m.mapDiv.css("left") );
		var mapDivTop = parseInt( m.mapDiv.css("top") );
		
		var xDist = event.offsetX;
		var yDist = event.offsetY;

		var newLeft = mapDivLeft - xDist * factor;
		var newTop = mapDivTop - yDist * factor;

		var oldWidth = m.mapDiv.width();
		var oldHeight = m.mapDiv.height();

		if (m.lockEdges) {
			
			m.mapDiv.width( oldWidth * (1 + factor) );
			m.mapDiv.height( oldHeight * (1 + factor) );

			var rightEdge = -m.mapDiv.outerWidth() + m.mapView.outerWidth(),
               		 topEdge = -m.mapDiv.outerHeight() + m.mapView.outerHeight();

               	if (newLeft < rightEdge || newLeft > 0 || newTop < topEdge || newTop > 0) {
               		m.mapDiv.width(oldWidth);
               		m.mapDiv.height(oldHeight);
               		return;
               	}

		} else {
			$(param.mapDivId).width( $(param.mapDivId).width() * (1 + factor) );
			$(param.mapDivId).height( $(param.mapDivId).height() * (1 + factor) );
		}

		

		$(param.mapDivId).css("left", newLeft + "px");
		$(param.mapDivId).css("top", newTop + "px");

		$(param.mapId).width( $(param.mapDivId).width() );
		$(param.mapId).height( $(param.mapDivId).height() );
	});

	function Coordinate(startX, startY) {
        this.x = startX;
        this.y = startY;
    }



    function moveMap (x, y) {
    	var newX = x, newY = y;
        if(m.lockEdges) {
            var rightEdge = -m.mapDiv.outerWidth() + m.mapView.outerWidth(),
                topEdge = -m.mapDiv.outerHeight() + m.mapView.outerHeight();
            newX = newX < rightEdge ? rightEdge : newX;
            newY = newY < topEdge ? topEdge : newY;
            newX = newX > 0 ? 0 : newX;
            newY = newY > 0 ? 0 : newY;
        }
        m.mapDiv.css("left", newX + "px");
        m.mapDiv.css("top", newY + "px");
    }

    m.mapView.mousemove(function (b) {
    	if (!m.mouseDown) {
    		return;
    	}
        var e = b.clientX - m.mousePosition.x + parseInt(m.mapDiv.css("left")),
            d = b.clientY - m.mousePosition.y + parseInt(m.mapDiv.css("top"));
        moveMap(e, d);
        m.mousePosition.x = b.clientX;
        m.mousePosition.y = b.clientY
    });

    m.mapView.mousedown(function (e) {
    	m.mapView.css("cursor", "url(data:image/x-win-bitmap;base64,AAACAAEAICACAAcABQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA/AAAAfwAAAP+AAAH/gAAB/8AAAH/AAAB/wAAA/0AAANsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////gH///4B///8Af//+AD///AA///wAH//+AB///wAf//4AH//+AD///yT/////////////////////////////8=), default");

    	m.mousePosition.x = e.clientX;
       m.mousePosition.y = e.clientY;
       m.mouseDown = true;

       // If the map is set to continue scrolling after the mouse is released,
        // start a timer for that animation
        if(m.scrolling) {
            m.timerCount = 0;

            if(m.timerId != 0)
            {
                clearInterval(m.timerId);
                m.timerId = 0;
            }
            
            m.timerId = setInterval(OnScrollTimer, 20);
        }

       e.preventDefault();
    });

    m.mapView.mouseup(function (e) {
    	m.mouseDown = false;

    	if(m.mouseLocations.length > 0) {
            var clickCount = m.mouseLocations.length;
            m.velocity.x = (m.mouseLocations[clickCount - 1].x - m.mouseLocations[0].x) / clickCount;
            m.velocity.y = (m.mouseLocations[clickCount - 1].y - m.mouseLocations[0].y) / clickCount;
            m.mouseLocations.length = 0;
        }

    	m.mapView.css("cursor", "auto");
    });

    m.mapView.mouseleave(function (event) {
    	m.mapView.trigger("mouseup");
    });

    m.mousePosition = new Coordinate;
    m.mouseLocations = [];
    m.velocity = new Coordinate;
    m.mouseDown = false;
    m.timerId = -1;
    m.timerCount = 0;
    m.lockEdges = (param.lockEdges == undefined ? true : param.lockEdges);
    m.scrolling = (param.scrolling == undefined ? true : param.scrolling);
    m.scrollTime = typeof param.scrollTime == "undefined" ? 300 : param.scrollTime;

    /**
     * Name:        OnScrollTimer()
     * Description: Function called every time that the scroll timer fires
     */
    var OnScrollTimer = function () {
        if(m.mouseDown) {
            // Keep track of where the latest mouse location is
            m.mouseLocations.unshift(new Coordinate(m.mousePosition.x,
                                                    m.mousePosition.y));
            
            // Make sure that we're only keeping track of the last 10 mouse
            // clicks (just for efficiency)
            if(m.mouseLocations.length > 10)
                m.mouseLocations.pop();
        } else {
            
            var totalTics = m.scrollTime / 20;

            var fractionRemaining = (totalTics - m.timerCount) / totalTics;
            
            var xVelocity = m.velocity.x * fractionRemaining;
            var yVelocity = m.velocity.y * fractionRemaining;
            
            moveMap(-xVelocity + parseInt(m.mapDiv.css("left")),
                    -yVelocity + parseInt(m.mapDiv.css("top")));

            // Only scroll for 20 calls of this function
            if(m.timerCount == totalTics) {
                clearInterval(m.timerId);
                m.timerId = -1
            }

            ++m.timerCount;
        }
    };


}