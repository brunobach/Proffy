import React, {useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';

import PageHeader  from '../../components/PageHeader';

import TeatcherItem, {Teacher} from '../../components/TeacherItem';

import styles from './styles';



function Favorites() {
    
    const [favorites, setFavorites] = useState([]);
    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeacher = JSON.parse(response);
                
                
                setFavorites(favoritedTeacher);
            }
        });
    }

     // dispara função assim que o componente é exibido em tela
    // {} => qual função vai ser disparada [] => quando vai ser disparada se muda dispara de novo
    // [] => se vazio dispara uma unica vez
    /*useEffect(() => {
        
    }, [])*/
    

    // executa toda vez que a tela entrar em foco
    useFocusEffect(() => {
        loadFavorites();
    });


    

  return (
    <View style={styles.container}>
        <PageHeader title="Meus proffys favoritos" />

        <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {favorites.map((teacher: Teacher) => {
                    return (
                        <TeatcherItem 
                            key={teacher.id}
                            teacher={teacher}
                            favorited
                        />
                    )
                })}
        </ScrollView>

    </View>
);
}

export default Favorites;