// sendMoney, getHistory, topUp


export const sendMoney = async (req, res) => {
    try {
        const {receiver, amount, type, note="With ❤️ from SadakPe"} = req.body;
        const sender = req.user.name;

        // credit type;
        if(type == "credit"){

        } 

        // debit type;
        
    }
    catch(err){
        return res.status(500).send({message: "Aap (ya hum) SadakPe aagye..\n\n" + err.message})
    }
}

export const getHistory = async (req, res) => {}

export const topUp = async (req, res) => {}