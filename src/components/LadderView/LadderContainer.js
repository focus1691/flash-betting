import React from "react";


export default ({isReferenceSet, order, containerRef, isMoving, isLadderDown, setIsReferenceSet, runners, ladderOrderList, swapLadders, setIsMoving, setLadderDown, children}) => {

    const onLoad = () => e => {
        setIsReferenceSet(true);
    };

    const handleMouseMove = () => e => {
        if (containerRef.current === null) return;
        if (!isLadderDown) return;
        moveLadder(e.movementX, e.clientX, isReferenceSet, containerRef, order, runners, ladderOrderList, swapLadders, setIsMoving);
    };

    const handleMouseUp= () => e => {
        if (containerRef.current === null) return;
        if (!isLadderDown) return;
        setLadderDown(false);
        returnToOrderedPos(containerRef, order, setIsMoving);
    };

    const handleMouseLeave = () => e => {
        if (containerRef.current === null) return;
        if (!isLadderDown) return;
        setLadderDown(false);
        returnToOrderedPos(containerRef, order, setIsMoving); 
    };

    return (
        <div 
            className="odds-table" 
            style={{
                left: isReferenceSet ? `${order * containerRef.current.clientWidth}px` : `0px`,
                visibility: isReferenceSet ? 'visible' : 'collapse',
                opacity: isMoving ? '0.7' : '1.0',
                cursor: isLadderDown ? 'move' : 'default'
            }} 
            ref = {containerRef}
            onLoad={onLoad()}
            onMouseMove = {handleMouseMove()}
            onMouseUp={handleMouseUp()}
            onMouseLeave = {handleMouseLeave()}
        >
            {children}
        </div>
    )
};

const returnToOrderedPos = (containerRef, order, setIsMoving) => {
    containerRef.current.style.left = `${order * containerRef.current.clientWidth}px`
    containerRef.current.style['z-index'] = 0;
    setIsMoving(false);
}

const moveLadder = (offsetPos, cursorPosition, isReferenceSet, containerRef, order, runners, ladderOrderList, swapLadders, setIsMoving) => {
    if (!isReferenceSet) return
    containerRef.current.style.left = `${parseInt(containerRef.current.style.left, 10) + offsetPos}px`
    containerRef.current.style['z-index'] = 9999;
    

    // filter out the current ladder
    const otherNodes = {}
    for (const key in containerRef.current.parentNode.childNodes) {
        if (key == order + 1 || key == order - 1) { // check for only the one before and after it
            otherNodes[key] = containerRef.current.parentNode.childNodes[key];
        }
    }

    // find the mid way point of the other nodes
    const relativeCursorPosition = cursorPosition - containerRef.current.offsetParent.offsetLeft
    for (const key in otherNodes) {
        const midPoint = parseInt(otherNodes[key].style.left, 10) + otherNodes[key].clientWidth / 2

        if ((relativeCursorPosition > midPoint && order < key) || (relativeCursorPosition < midPoint && order > key)) {  // move right or left

            // we have to find the actual id if one of the ladders are hidden

            
            const thisLadderIndex = Object.values(runners).findIndex(item => item.runnerName.replace(/[0-9.]*[.,\s]/g, ' ').trim() == containerRef.current.children[0].children[0].childNodes[0].childNodes[1].data.replace(/[0-9.]*[.,\s]/g, ' ').trim()) // ladder header -> contender name -> name 
            const thisLadderId = Object.keys(runners)[thisLadderIndex]
            
            const thisLadderOrder = Object.values(ladderOrderList).findIndex(item => item == thisLadderId)
            if (thisLadderOrder === -1) break;

            const otherLadderIndex = Object.values(runners).findIndex(item => item.runnerName.replace(/[0-9.]*[.,\s]/g, ' ').trim() == otherNodes[key].children[0].children[0].childNodes[0].childNodes[1].data.replace(/[0-9.]*[.,\s]/g, ' ').trim()) // ladder header -> contender name -> name 
            const otherLadderId = Object.keys(runners)[otherLadderIndex]
            
            const otherLadderOrder = Object.values(ladderOrderList).findIndex(item => item == otherLadderId)
            if (otherLadderOrder === -1) break;

            swapLadders(thisLadderOrder, otherLadderOrder);

            otherNodes[key].style.left = `${order * containerRef.current.clientWidth}px`
            
            break;   
        }
    }
    setIsMoving(true);
}