import NicknameRequest from "../models/NicknameApproval.model";

export async function nicknameRequest_CREATE(
  val: string,
  userId: string,
  messageId: string
) {
  try {
    await NicknameRequest.create({
      userId,
      messageId,
      nickname: val,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function nicknameRequest_REMOVE(messageId: string) {
  try {
    await NicknameRequest.findOneAndDelete({ messageId });
  } catch (error) {
    console.log(error);
  }
}
