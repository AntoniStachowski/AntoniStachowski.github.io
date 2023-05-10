
let epsilon = 0.000001;

function shallowEqual(object1, object2) {
    return object1.id == object2.id;
  }

const optimise = (substitutes, originalId, count, refund) => {
    //get original from substitutes
    const original = substitutes.find(item => item.id === originalId);
    //Ziemniak
    const content = original.amount;
    const totalContentCount = content * count;
    const dose = original.dose.split("+").map(d => parseFloat(d));

    let bestPrice = original.upcharge * count;

    const calculatePrice = (substitute) => {
        if (shallowEqual(substitute, original)) {
            return;
        }
        if (substitute.refund != refund) {
            return;
        }
        const substitutePrice = substitute.upcharge;
        const substituteContentCount = substitute.amount;
        const substituteDose = substitute.dose.split("+").map(d => parseFloat(d));
        
        const doseRatio = dose[0] / substituteDose[0];

        for(let i = 1; i < dose.length; i++) {
            if (Math.abs(doseRatio - dose[i] / substituteDose[i]) > epsilon) {
                return;
            }
        }

        const roundedDoseRatio = Math.round(doseRatio);
        if (Math.abs(doseRatio - roundedDoseRatio) > epsilon) {
            return;
        }

        const neededContentCount = totalContentCount * roundedDoseRatio;
        const neededSubstituteCount = Math.ceil(neededContentCount / substituteContentCount);
        if (neededSubstituteCount * substituteContentCount > 1.1 * neededContentCount) {
            return;
        }

        const price = substitutePrice * neededSubstituteCount;

        if (price > bestPrice) {
            return;
        }
        return {price: price, amount: neededSubstituteCount, substitute: substitute};
    }

    const result = substitutes.map(calculatePrice).filter(item => item !== undefined);

    return result.sort((a, b) => a.price - b.price);
}


export default optimise;