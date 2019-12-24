import React, {useState} from 'react'
import { TouchableOpacity, StyleSheet, Text, Image, Dimensions } from 'react-native';
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Grayscale } from 'react-native-color-matrix-image-filters';

const LikeAndDislikeKudo = gql`
  mutation likeAndDislikeKudo($kudo_id: Uint!, $attendee_receiver_id: Uint!, $attendee_giver_id: Uint!, $is_like: Boolean!) {
    likeAndDislikeKudo(kudo_id: $kudo_id, attendee_receiver_id: $attendee_receiver_id, attendee_giver_id: $attendee_giver_id, is_like: $is_like) {
      id
      count
    }
  }
`

const { width, height } = Dimensions.get('window');
export default ({item, attendee, isMe, authStore}) => {
    const [kudoGivens, setKudoGivens] = useState(item.kudo_givens.map(ob => ob.attendee_giver_id)); //array type
    const [count, setCount] = useState(kudoGivens.length); //int type
    const [isLiked, setIsLiked] = useState(kudoGivens.includes(authStore.profile.id)) //bool type

    const handleCreate = (likeAndDislikeKudo) => {
        if(authStore.profile.id !== attendee.id){
            likeAndDislikeKudo({
                variables: {
                    kudo_id: item.id,
                    attendee_receiver_id: attendee.id,
                    attendee_giver_id: authStore.profile.id,
                    is_like: isLiked
                }
            })
        }
    }

    const onUpdate = (_cache, {data}) =>{
        setIsLiked(!isLiked)
        setCount(data.likeAndDislikeKudo.count)
        // let arr;
        // if(kudoGivens.includes(authStore.profile.id)){
        //     arr = kudoGivens.filter(givenId => givenId !== authStore.profile.id)
        // }else{
        //     arr = kudoGivens.concat([authStore.profile.id])
        // }
        // setKudoGivens(arr)
    }

    return(
        <Mutation mutation={LikeAndDislikeKudo} update={onUpdate} onCompleted={()=> console.log("compleete")}>
          {(likeAndDislikeKudo) => {
            const amountGray = (isLiked || (isMe && count > 0)) ? 0 : 1;
            return(
                <TouchableOpacity
                    disabled={authStore.profile.id === attendee.id}
                    style={styles.container}
                    onPress={()=> handleCreate(likeAndDislikeKudo)}
                >
                    <Grayscale amount={amountGray}> 
                        <Image source={{ uri: item.src }} style={styles.image} /> 
                    </Grayscale>
                    <Text style={styles.text}>{count}</Text>
                </TouchableOpacity>
              );
            }
        }
        </Mutation>
    )
}

const kudoContainerWidth = width / 4;
const kudoImageWidth = kudoContainerWidth * 0.6;
var styles = StyleSheet.create({
    container: {
        width: kudoContainerWidth,
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: kudoContainerWidth / 10,
    },
    image: {
        width: kudoImageWidth,
        height: kudoImageWidth,
    },
    text: {
        fontSize: width / 30,
        fontWeight: '700',
        margin: width / 40,
    },
})
  