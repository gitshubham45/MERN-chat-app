import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";


const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain , setFetchAgain] = useState(false);

    // console.log(user,"in chatPage")
    
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="89.5vh"
                p="10px"
                backgroundColor="blue"
            >
                {user && <MyChats fetchAgain={fetchAgain}  />}
                {user &&  <ChatBox  fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} />}
                
            </Box>
        </div>

    )
}

export default ChatPage;
