
let epsilon = 0.000001;

function shallowEqual(object1, object2) {
    return object1.id == object2.id;
  }

const optimise = (substitutes, originalId, count) => {
    //get original from substitutes
    const original = substitutes.find(item => item.id === originalId);
    
    const content = original.amount;
    const totalContentCount = content * count;
    const dose = original.dose.split("+").map(d => parseFloat(d));
    //console.log("Dose: " + dose);

    let bestPrice = original.upcharge * count;

    const calculatePrice = (substitute) => {
        if (shallowEqual(substitute, original)) {
            return;
        }
        const substitutePrice = substitute.upcharge;
        const substituteContentCount = substitute.amount;
        const substituteDose = substitute.dose.split("+").map(d => parseFloat(d));
        //console.log("Substitute dose: " + substituteDose);

        //console.log(substitute);
        
        const doseRatio = dose[0] / substituteDose[0];
        //console.log("Dose ratio: " + doseRatio);

        for(let i = 1; i < dose.length; i++) {
            if (Math.abs(doseRatio - dose[i] / substituteDose[i]) > epsilon) {
                //console.log("Dose ratio is not the same");
                return;
            }
        }

        const roundedDoseRatio = Math.round(doseRatio);
        if (Math.abs(doseRatio - roundedDoseRatio) > epsilon) {
            //console.log("Dose ratio is not an integer");
            return;
        }

        const neededContentCount = totalContentCount * roundedDoseRatio;
        //console.log("Needed content count: " + neededContentCount);
        const neededSubstituteCount = Math.ceil(neededContentCount / substituteContentCount);
        //console.log("Needed substitute count: " + neededSubstituteCount);
        if (neededSubstituteCount * substituteContentCount > 1.1 * neededContentCount) {
            //console.log("Substitute is too big");
            return;
        }

        //console.log("Substitute count: " + neededSubstituteCount);
        //console.log("Substitute price: " + substitutePrice);
        const price = substitutePrice * neededSubstituteCount;
        //console.log("Price: " + price);

        if (price > bestPrice) {
            return;
        }
        return {price: price, substitute: substitute};
    }

    const result = substitutes.map(calculatePrice).filter(item => item !== undefined);

    return result.sort((a, b) => a.price - b.price);
}


export default optimise;