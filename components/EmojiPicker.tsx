import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, onClose, children }: Props) {
    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.modalContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Choose an emoji</Text>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" size={38} color="#25292e" />
                        </Pressable>
                    </View>
                    {children}
                </View>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#25292e',
        height: '25%',
        width: '100%',
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: '#464C55',
        paddingHorizontal: 20
    },
    titleText: {
        color: '#fff',
        fontSize: 16
    }
})