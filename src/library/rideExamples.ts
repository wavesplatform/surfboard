export type sampleTypes = 'fomo' | 'wallet';

export const rideExamples: {
    [id in sampleTypes]: string
} = {
    fomo: `{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}

let lpKey = "lastPayment"
let liKey = "bestFomoer"
let lhKey = "height"
let day = 1440

@Callable(i)
func fearmissing() = {
    let payment = match i.payment {
        case p:AttachedPayment =>
                match p.assetId  {
                    case assetId: ByteVector => throw("fomo waves only")
                    case _ => p.amount
                }

        case _ => throw("payment must be attached")
    }
    let lastPayment = match getInteger(this, "lastPayment") {
        case p:Int => p
        case _ => 0
    }

    if(payment <= lastPayment)
        then throw("min payment is " +toString(payment))
        else # storing best payment, caller and height
            WriteSet([
                DataEntry(lpKey, payment),
                DataEntry(liKey, i.caller.bytes),
                DataEntry(lhKey, height)
            ])
}

@Callable(i)
func withdraw() = {
    let callerCorrect = i.caller.bytes == extract(getBinary(this, liKey))
    let heightCorrect = extract(getInteger(this, lhKey)) - height >= day
    let canWithdraw = heightCorrect && callerCorrect

    if (canWithdraw)
        then TransferSet([ScriptTransfer(i.caller, wavesBalance(this), unit)])
        else throw("behold")
}
`,
    wallet: `# In this example multiple accounts can deposit their funds and safely take them back, no one can interfere with this.
# An inner state is maintained as mapping \`address=>waves\`.

{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}

@Callable(i)
func deposit() = {
   let pmt = extract(i.payment)
   if (isDefined(pmt.assetId)) then throw("can hodl waves only at the moment")
   else {
        let currentKey = toBase58String(i.caller.bytes)
        let currentAmount = match getInteger(this, currentKey) {
            case a:Int => a
            case _ => 0
        }
        let newAmount = currentAmount + pmt.amount
        WriteSet([DataEntry(currentKey, newAmount)])
   }
}

@Callable(i)
func withdraw(amount: Int) = {
        let currentKey = toBase58String(i.caller.bytes)
        let currentAmount = match getInteger(this, currentKey) {
            case a:Int => a
            case _ => 0
        }
        let newAmount = currentAmount - amount
     if (amount < 0)
            then throw("Can't withdraw negative amount")
    else if (newAmount < 0)
            then throw("Not enough balance")
            else ScriptResult(
                    WriteSet([DataEntry(currentKey, newAmount)]),
                    TransferSet([ScriptTransfer(i.caller, amount, unit)])
                )
}

`
};
