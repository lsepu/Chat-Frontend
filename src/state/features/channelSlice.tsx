import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stateType } from "../store";

const URL_BASE = "https://realtime-chat-app-sofkau.herokuapp.com";

export type channelType = {
    //Canales
    id?: string;
    name: string;
    description: string;
};

interface channelState extends channelType { }

export enum channelFetchStatus {
    IDLE = "idle",
    COMPLETED = "completed",
    FAILED = "failed",
    PENDING = "pending",
}

interface IChannel {
    channel: channelState[];
    status: channelFetchStatus;
    error: string | null;
}

const initialState: IChannel = {
    channel: [],
    status: channelFetchStatus.IDLE,
    error: null,
};

export const getAllChannels = createAsyncThunk('getAllChannels', async () => {
    const response = await fetch(URL_BASE+"/channel")
    return (await response.json()) as channelType[]
})

export const postChannel = createAsyncThunk(
    "postChannel",
    async (newChannel: channelType) => {
        const response = await fetch(
            URL_BASE+"/channel",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(newChannel),
            }
        );
        return (await response.json()) as channelType;
    }
);

export const updateChannel = createAsyncThunk(
    "updateChannel",

    async (channel: channelType) => {

        const response = await fetch(
            URL_BASE+"/channel",
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(channel),
            }
        );
        return channel as channelType;
        // console.log(response);
        // return (await response.json()) as channelType;
    }
);

export const deleteChannel = createAsyncThunk(
    "deleteChannel",
    async (id: string|undefined) => {
        const response = await fetch(URL_BASE+`/channel/${id}`, {
          method: "DELETE",
        });
        return id;
      }
    );

export const channelSSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        //get
        builder.addCase(getAllChannels.pending, (state) => {
            state.status = channelFetchStatus.PENDING
        })
        builder.addCase(getAllChannels.fulfilled, (state, action) => {
            state.status = channelFetchStatus.COMPLETED
            state.channel = action.payload
        })
        builder.addCase(getAllChannels.rejected, (state, action) => {
            state.status = channelFetchStatus.FAILED
            state.error = 'Something went wrong while fetching'
            state.channel = []
        })
        //post
        builder.addCase(postChannel.pending, (state) => {
            state.status = channelFetchStatus.PENDING;
        });

        builder.addCase(postChannel.fulfilled, (state, action) => {
            state.status = channelFetchStatus.COMPLETED;
            state.channel.push(action.payload);
        });

        builder.addCase(postChannel.rejected, (state) => {
            state.status = channelFetchStatus.FAILED;
            state.error = "Something went wrong while fetching";
        });

        //put
        builder.addCase(updateChannel.pending, (state) => {
            state.status = channelFetchStatus.PENDING;
        });

        builder.addCase(updateChannel.fulfilled, (state, action) => {
            state.status = channelFetchStatus.COMPLETED;
            //state.channel = action.payload;
        });

        builder.addCase(updateChannel.rejected, (state) => {

            state.status = channelFetchStatus.FAILED;
            state.error = "Something went wrong while fetching";
        });

        //delete
        builder.addCase(deleteChannel.pending, (state) => {
            state.status = channelFetchStatus.PENDING;
        });

        builder.addCase(deleteChannel.fulfilled, (state, action) => {
            state.status = channelFetchStatus.COMPLETED;
            state.channel = state.channel.filter((channel) => channel.id  !== action.payload);
        });

        builder.addCase(deleteChannel.rejected, (state) => {
            state.status = channelFetchStatus.FAILED;
            state.error = "Something went wrong while fetching";
        });
    },
});

export default channelSSlice.reducer;

export const selectChannelStatus = () => (state: stateType) =>
    state.channels.status;
export const selectChannel = () => (state: stateType) => state.channels.channel;
export const selectChannelError = () => (state: stateType) =>
    state.channels.error;
