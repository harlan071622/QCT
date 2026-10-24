import { useEffect, useState } from 'react'
import {
  addRecipeToFirestore,
  getRecipesFromFirestore,
  isFirebaseConfigured,
} from './firebase'
import './App.css'

const dishTypeOptions = [
  'Pastry',
  'Drinks',
  'Beef',
  'Chicken',
  'Lamb',
  'Pork',
  'Deer',
  'Fish',
  'Seafood',
  'Turkey',
  'Eggs',
  'Tofu',
  'Vegetables',
  'Vegan',
  'Other',
]

const originOptions = [
  'Western Asia',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Central Asia',
  'Europe',
  'Mediterranean',
  'North Africa',
  'Sub-Saharan Africa',
  'North America',
  'Central America',
  'Caribbean',
  'South America',
  'Oceania',
  'Global / Fusion',
]

const starterRecipes = [
  {
    id: 1,
    title: 'Lemon Herb Salmon',
    category: 'Dinner',
    dishType: 'Fish',
    origin: 'Mediterranean',
    imageUrl:
      'https://images.unsplash.com/photo-1467003909585-6f8a72700288?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 1, name: 'salmon fillet', unit: 'lb' },
      { id: 2, name: 'lemon', unit: 'none' },
      { id: 3, name: 'fresh dill', unit: 'tbsp' },
      { id: 4, name: 'olive oil', unit: 'tbsp' },
    ],
    instructions:
      'Season the salmon with lemon, dill, and olive oil, then bake until it flakes easily and serves beautifully with greens.',
  },
  {
    id: 2,
    title: 'Spicy Chicken Tikka Masala',
    category: 'Dinner',
    dishType: 'Chicken',
    origin: 'South Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 5, name: 'chicken breast', unit: 'lb' },
      { id: 6, name: 'tomato puree', unit: 'cup' },
      { id: 7, name: 'garlic', unit: 'clove' },
      { id: 8, name: 'garam masala', unit: 'tsp' },
    ],
    instructions:
      'Marinate the chicken, sear until golden, then simmer in the tomato sauce and spices until rich, creamy, and aromatic.',
  },
  {
    id: 3,
    title: 'Mushroom Risotto',
    category: 'Dinner',
    dishType: 'Vegetables',
    origin: 'Europe',
    imageUrl:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 9, name: 'arborio rice', unit: 'cup' },
      { id: 10, name: 'mushrooms', unit: 'cup' },
      { id: 11, name: 'vegetable stock', unit: 'cup' },
      { id: 12, name: 'parmesan', unit: 'tbsp' },
    ],
    instructions:
      'Sauté mushrooms, toast the rice, then add warm stock gradually until creamy and tender. Finish with parmesan and black pepper.',
  },
  {
    id: 4,
    title: 'Tacos al Pastor',
    category: 'Dinner',
    dishType: 'Pork',
    origin: 'Central America',
    imageUrl:
      'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 13, name: 'pork shoulder', unit: 'lb' },
      { id: 14, name: 'corn tortillas', unit: 'none' },
      { id: 15, name: 'pineapple', unit: 'cup' },
      { id: 16, name: 'onion', unit: 'none' },
    ],
    instructions:
      'Cook the pork with pineapple and spices until caramelized, then serve in warm tortillas with onion and fresh salsa.',
  },
  {
    id: 5,
    title: 'Bulgogi Rice Bowl',
    category: 'Dinner',
    dishType: 'Beef',
    origin: 'East Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 17, name: 'beef strips', unit: 'lb' },
      { id: 18, name: 'rice', unit: 'cup' },
      { id: 19, name: 'kimchi', unit: 'cup' },
      { id: 20, name: 'scallions', unit: 'tbsp' },
    ],
    instructions:
      'Marinate the beef, sear until browned, then serve over rice with kimchi and scallions for a savory bowl.',
  },
  {
    id: 6,
    title: 'Cauliflower Shawarma Wrap',
    category: 'Lunch',
    dishType: 'Vegan',
    origin: 'Western Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 21, name: 'cauliflower', unit: 'head' },
      { id: 22, name: 'flatbread', unit: 'none' },
      { id: 23, name: 'cucumber', unit: 'none' },
      { id: 24, name: 'tahini sauce', unit: 'tbsp' },
    ],
    instructions:
      'Roast the cauliflower with shawarma spices, then load into warm flatbread with cucumber and tahini sauce.',
  },
  {
    id: 7,
    title: 'Thai Green Curry',
    category: 'Dinner',
    dishType: 'Vegetables',
    origin: 'Southeast Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 25, name: 'coconut milk', unit: 'cup' },
      { id: 26, name: 'green curry paste', unit: 'tbsp' },
      { id: 27, name: 'broccoli', unit: 'cup' },
      { id: 28, name: 'basil leaves', unit: 'none' },
    ],
    instructions:
      'Simmer the curry paste in coconut milk, add the vegetables, and finish with basil for a fragrant, creamy bowl.',
  },
  {
    id: 8,
    title: 'Lobster Bisque',
    category: 'Dinner',
    dishType: 'Seafood',
    origin: 'Europe',
    imageUrl:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 29, name: 'lobster meat', unit: 'cup' },
      { id: 30, name: 'cream', unit: 'cup' },
      { id: 31, name: 'tomato', unit: 'none' },
      { id: 32, name: 'thyme', unit: 'tsp' },
    ],
    instructions:
      'Cook lobster meat with tomatoes and herbs, stir in cream, and blend until silky and rich enough for a comforting bowl.',
  },
  {
    id: 9,
    title: 'Beef Bourguignon',
    category: 'Dinner',
    dishType: 'Beef',
    origin: 'Europe',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 33, name: 'beef chuck', unit: 'lb' },
      { id: 34, name: 'red wine', unit: 'cup' },
      { id: 35, name: 'carrots', unit: 'cup' },
      { id: 36, name: 'shallots', unit: 'none' },
    ],
    instructions:
      'Brown the beef, soften the vegetables, then slowly braise everything with wine until the sauce thickens and the meat turns tender.',
  },
  {
    id: 10,
    title: 'Vegetable Paella',
    category: 'Dinner',
    dishType: 'Vegetables',
    origin: 'Mediterranean',
    imageUrl:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 37, name: 'rice', unit: 'cup' },
      { id: 38, name: 'peppers', unit: 'cup' },
      { id: 39, name: 'peas', unit: 'cup' },
      { id: 40, name: 'saffron', unit: 'pinch' },
    ],
    instructions:
      'Cook the rice with saffron and vegetables until the grains absorb the rich broth and the pan develops a golden crust.',
  },
  {
    id: 11,
    title: 'Stuffed Peppers',
    category: 'Dinner',
    dishType: 'Vegan',
    origin: 'North America',
    imageUrl:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 41, name: 'bell peppers', unit: 'none' },
      { id: 42, name: 'quinoa', unit: 'cup' },
      { id: 43, name: 'black beans', unit: 'cup' },
      { id: 44, name: 'corn', unit: 'cup' },
    ],
    instructions:
      'Stuff the peppers with quinoa, beans, and corn, then bake until tender and the tops are lightly browned.',
  },
  {
    id: 12,
    title: 'Chicken Satay Skewers',
    category: 'Lunch',
    dishType: 'Chicken',
    origin: 'Southeast Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 45, name: 'chicken thighs', unit: 'lb' },
      { id: 46, name: 'peanut sauce', unit: 'tbsp' },
      { id: 47, name: 'lime', unit: 'none' },
      { id: 48, name: 'coconut', unit: 'tbsp' },
    ],
    instructions:
      'Thread the chicken onto skewers, grill until smoky and juicy, then drizzle with peanut sauce and a squeeze of lime.',
  },
  {
    id: 13,
    title: 'Lentil Shepherd’s Pie',
    category: 'Dinner',
    dishType: 'Vegan',
    origin: 'Europe',
    imageUrl:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 49, name: 'lentils', unit: 'cup' },
      { id: 50, name: 'potatoes', unit: 'lb' },
      { id: 51, name: 'carrots', unit: 'cup' },
      { id: 52, name: 'onion', unit: 'none' },
    ],
    instructions:
      'Cook the lentils and vegetables until thickened, top with mashed potatoes, and bake until the surface is golden and crisp.',
  },
  {
    id: 14,
    title: 'Pork Adobo',
    category: 'Dinner',
    dishType: 'Pork',
    origin: 'Southeast Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 53, name: 'pork belly', unit: 'lb' },
      { id: 54, name: 'soy sauce', unit: 'tbsp' },
      { id: 55, name: 'vinegar', unit: 'tbsp' },
      { id: 56, name: 'garlic', unit: 'clove' },
    ],
    instructions:
      'Simmer the pork in soy sauce, vinegar, and garlic until the sauce deepens and the meat becomes tender and savory.',
  },
  {
    id: 15,
    title: 'Classic Tiramisu',
    category: 'Dessert',
    dishType: 'Pastry',
    origin: 'Europe',
    imageUrl:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 57, name: 'ladyfingers', unit: 'none' },
      { id: 58, name: 'mascarpone', unit: 'cup' },
      { id: 59, name: 'espresso', unit: 'cup' },
      { id: 60, name: 'cocoa powder', unit: 'tbsp' },
    ],
    instructions:
      'Layer espresso-soaked biscuits with mascarpone cream, chill until set, and finish with a dusting of cocoa powder.',
  },
  {
    id: 16,
    title: 'Mango Sticky Rice',
    category: 'Dessert',
    dishType: 'Other',
    origin: 'Southeast Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1551024601-bec78aea1d77?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 61, name: 'glutinous rice', unit: 'cup' },
      { id: 62, name: 'mango', unit: 'none' },
      { id: 63, name: 'coconut milk', unit: 'cup' },
      { id: 64, name: 'sesame seeds', unit: 'tbsp' },
    ],
    instructions:
      'Cook the rice with coconut milk until chewy and glossy, then serve with sliced mango and toasted sesame seeds.',
  },
  {
    id: 17,
    title: 'Chicken Caesar Salad',
    category: 'Lunch',
    dishType: 'Chicken',
    origin: 'North America',
    imageUrl:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 65, name: 'romaine lettuce', unit: 'cup' },
      { id: 66, name: 'grilled chicken', unit: 'cup' },
      { id: 67, name: 'caesar dressing', unit: 'tbsp' },
      { id: 68, name: 'parmesan', unit: 'tbsp' },
    ],
    instructions:
      'Toss the lettuce, chicken, and dressing together, then finish with parmesan for a bright, crunchy lunch.',
  },
  {
    id: 18,
    title: 'Lamb Kofta Bowl',
    category: 'Dinner',
    dishType: 'Lamb',
    origin: 'Western Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 69, name: 'ground lamb', unit: 'lb' },
      { id: 70, name: 'rice', unit: 'cup' },
      { id: 71, name: 'tomato', unit: 'none' },
      { id: 72, name: 'cucumber', unit: 'none' },
    ],
    instructions:
      'Shape the lamb into kofta, sear until juicy, and serve with rice, cucumber, and tomato for a fresh flavor-packed bowl.',
  },
  {
    id: 19,
    title: 'Caribbean Jerk Tofu',
    category: 'Dinner',
    dishType: 'Tofu',
    origin: 'Caribbean',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 73, name: 'tofu', unit: 'block' },
      { id: 74, name: 'jerk seasoning', unit: 'tbsp' },
      { id: 75, name: 'pineapple', unit: 'cup' },
      { id: 76, name: 'scallions', unit: 'tbsp' },
    ],
    instructions:
      'Coat tofu with jerk seasoning, roast until caramelized, and serve with pineapple and scallions for a sweet-spicy finish.',
  },
  {
    id: 20,
    title: 'Matcha Pancakes',
    category: 'Breakfast',
    dishType: 'Pastry',
    origin: 'East Asia',
    imageUrl:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80',
    author: 'Quick Cooking Tips',
    isAnonymous: false,
    ingredients: [
      { id: 77, name: 'matcha powder', unit: 'tbsp' },
      { id: 78, name: 'flour', unit: 'cup' },
      { id: 79, name: 'milk', unit: 'cup' },
      { id: 80, name: 'maple syrup', unit: 'tbsp' },
    ],
    instructions:
      'Whisk the batter, cook the pancakes on a griddle until they puff, and serve warm with maple syrup.',
  },
]

const createEmptyIngredient = () => ({
  id: Date.now() + Math.random(),
  name: '',
  unit: 'none',
})

function getRecipeImages(recipe) {
  if (Array.isArray(recipe?.images) && recipe.images.length > 0) {
    return recipe.images.filter(Boolean)
  }

  if (Array.isArray(recipe?.imageUrls) && recipe.imageUrls.length > 0) {
    return recipe.imageUrls.filter(Boolean)
  }

  if (typeof recipe?.imageUrl === 'string' && recipe.imageUrl.trim()) {
    return [recipe.imageUrl.trim()]
  }

  return []
}

function mergeRecipes(savedRecipes) {
  const recipesById = new Map()

  savedRecipes.forEach((recipe) => recipesById.set(recipe.id, recipe))

  return Array.from(recipesById.values())
}

function getRecipeDishType(recipe) {
  if (recipe.dishType) return recipe.dishType

  const recipeText = `${recipe.title} ${recipe.ingredients
    .map((ingredient) => ingredient.name)
    .join(' ')}`.toLowerCase()

  if (recipeText.includes('beef')) return 'Beef'
  if (recipeText.includes('chicken')) return 'Chicken'
  if (recipeText.includes('lamb')) return 'Lamb'
  if (recipeText.includes('pork')) return 'Pork'
  if (recipeText.includes('deer') || recipeText.includes('venison')) return 'Deer'
  if (recipeText.includes('turkey')) return 'Turkey'
  if (recipeText.includes('seafood') || recipeText.includes('shrimp')) return 'Seafood'
  if (recipeText.includes('fish') || recipeText.includes('salmon')) return 'Fish'
  if (recipeText.includes('tofu')) return 'Tofu'
  if (recipeText.includes('egg')) return 'Eggs'
  if (recipeText.includes('drink') || recipeText.includes('smoothie')) return 'Drinks'
  if (recipeText.includes('pastry') || recipeText.includes('croissant')) return 'Pastry'
  if (recipeText.includes('vegetable') || recipeText.includes('broccoli')) return 'Vegetables'

  return 'Other'
}

function getRecipeOrigin(recipe) {
  if (recipe.origin) return recipe.origin

  return 'Global / Fusion'
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Breakfast')
  const [dishType, setDishType] = useState('Vegan')
  const [origin, setOrigin] = useState('Global / Fusion')
  const [imageUrls, setImageUrls] = useState([])
  const [authorName, setAuthorName] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [ingredients, setIngredients] = useState([createEmptyIngredient()])
  const [instructions, setInstructions] = useState('')
  const [recipes, setRecipes] = useState(starterRecipes)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [selectedDishTypes, setSelectedDishTypes] = useState([])
  const [selectedOrigin, setSelectedOrigin] = useState('All Origins')

  const filteredRecipes =
    recipes.filter((recipe) => {
      const matchesDishType =
        selectedDishTypes.length === 0 || selectedDishTypes.includes(getRecipeDishType(recipe))
      const matchesOrigin =
        selectedOrigin === 'All Origins' || getRecipeOrigin(recipe) === selectedOrigin

      return matchesDishType && matchesOrigin
    })

  function toggleDishType(option) {
    setSelectedDishTypes((currentTypes) =>
      currentTypes.includes(option)
        ? currentTypes.filter((type) => type !== option)
        : [...currentTypes, option]
    )
  }

  useEffect(() => {
    async function loadRecipes() {
      const useLocalFallback = () => {
        const saved = localStorage.getItem('quick-cooking-recipes')

        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecipes(mergeRecipes(parsed))
            return
          }
        }

        setRecipes(starterRecipes)
      }

      try {
        if (isFirebaseConfigured) {
          try {
            const firebaseRecipes = await getRecipesFromFirestore()

            if (firebaseRecipes.length === 0) {
              try {
                const seededRecipes = await Promise.all(
                  starterRecipes.map((recipe) => addRecipeToFirestore(recipe))
                )
                setRecipes(mergeRecipes(seededRecipes))
              } catch (seedError) {
                console.error('Could not seed starter recipes:', seedError)
                useLocalFallback()
              }
            } else {
              setRecipes(mergeRecipes(firebaseRecipes))
            }
          } catch (firebaseError) {
            console.error('Could not load Firebase recipes:', firebaseError)
            useLocalFallback()
          }

          return
        }

        useLocalFallback()
      } catch (error) {
        console.error('Could not load recipes:', error)
        setRecipes(starterRecipes)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('quick-cooking-recipes', JSON.stringify(recipes))
    }
  }, [recipes])

  function addIngredientRow() {
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      createEmptyIngredient(),
    ])
  }

  function removeIngredientRow(idToRemove) {
    if (ingredients.length === 1) return

    setIngredients((currentIngredients) =>
      currentIngredients.filter((ingredient) => ingredient.id !== idToRemove)
    )
  }

  function updateIngredient(id, field, value) {
    setIngredients((currentIngredients) =>
      currentIngredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    )
  }

  async function handleImageUpload(event) {
    const selectedFiles = Array.from(event.target.files || [])

    if (selectedFiles.length === 0) return

    const fileUrls = await Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error(`Could not read file: ${file.name}`))
            reader.readAsDataURL(file)
          })
      )
    )

    setImageUrls((currentImages) => [...currentImages, ...fileUrls])
    event.target.value = ''
  }

  function resetForm() {
    setTitle('')
    setCategory('Breakfast')
    setDishType('Vegan')
    setOrigin('Global / Fusion')
    setImageUrls([])
    setAuthorName('')
    setAnonymous(true)
    setIngredients([createEmptyIngredient()])
    setInstructions('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanedIngredients = ingredients.filter(
      (ingredient) => ingredient.name.trim() !== ''
    )

    if (!title.trim() || cleanedIngredients.length === 0 || !instructions.trim()) {
      return
    }

    const recipeImages = imageUrls.filter(Boolean)

    const newRecipe = {
      id: Date.now(),
      title: title.trim(),
      category,
      dishType,
      origin,
      images: recipeImages,
      imageUrl: recipeImages[0] || '',
      author: anonymous ? 'Anonymous' : authorName.trim() || 'Community Member',
      isAnonymous: anonymous,
      ingredients: cleanedIngredients,
      instructions: instructions.trim(),
    }

    if (isFirebaseConfigured) {
      try {
        const savedRecipe = await addRecipeToFirestore(newRecipe)
        setRecipes((currentRecipes) => [savedRecipe, ...currentRecipes])
      } catch (error) {
        console.error('Failed to save recipe:', error)
      }
    } else {
      setRecipes((currentRecipes) => [newRecipe, ...currentRecipes])
    }

    resetForm()
    setIsModalOpen(false)
    setActiveTab('recipes')
  }

  return (
    <div className="mx-auto w-[calc(100%-2in)] px-4 py-6 md:px-6">
      <header className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-black/70 bg-white/60 px-5 py-4">
        <div className="text-3xl font-bold">
          <a href="/" className="brand-link">
            Quick Cooking Tips
          </a>
        </div>

        <nav className="flex flex-wrap gap-2.5">
          <button
            className={activeTab === 'home'
              ? 'rounded-lg border border-black/70 bg-neutral-900 px-4 py-2.5 font-semibold text-white transition'
              : 'rounded-lg border border-black/70 bg-transparent px-4 py-2.5 font-semibold text-black transition hover:bg-white/60'}
            onClick={() => setActiveTab('home')}
            type="button"
          >
            Home
          </button>
          <button
            className={activeTab === 'recipes'
              ? 'rounded-lg border border-black/70 bg-neutral-900 px-4 py-2.5 font-semibold text-white transition'
              : 'rounded-lg border border-black/70 bg-transparent px-4 py-2.5 font-semibold text-black transition hover:bg-white/60'}
            onClick={() => setActiveTab('recipes')}
            type="button"
          >
            Recipes
          </button>
          <button
            className={activeTab === 'about'
              ? 'rounded-lg border border-black/70 bg-neutral-900 px-4 py-2.5 font-semibold text-white transition'
              : 'rounded-lg border border-black/70 bg-transparent px-4 py-2.5 font-semibold text-black transition hover:bg-white/60'}
            onClick={() => setActiveTab('about')}
            type="button"
          >
            About
          </button>
        </nav>
      </header>

      <main className="rounded-2xl border border-black/70 bg-white/35 p-6">
        {activeTab === 'home' && (
          <section className="space-y-6">
            <div className="rounded-xl border border-black/70 bg-white/40 p-7">
              <p className="mb-2 text-[0.75rem] uppercase tracking-[0.08em] text-neutral-600">
                Fresh ideas every day
              </p>
              <h1 className="mb-3 text-4xl font-bold leading-tight md:text-5xl">
                Share recipes, kitchen wins, and family favorites.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-neutral-700">
                Discover simple food ideas, post your own recipe, and keep your kitchen
                inspiration in one place.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex rounded-lg border border-black/70 bg-[#f4d66d] px-4 py-2.5 font-bold text-black transition hover:brightness-95"
                onClick={() => setActiveTab('recipes')}
              >
                Explore Recipes
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-black/70 bg-white/40 py-3">
              <div className="flex w-max gap-4 animate-marquee">
                {[...recipes, ...recipes].map((recipe, index) => {
                  const recipeImages = getRecipeImages(recipe)

                  return (
                    <div
                      key={`${recipe.id}-${index}`}
                      className="relative h-60 w-80 shrink-0 overflow-hidden rounded-xl border border-black/70 bg-white/70"
                    >
                      {recipeImages.length > 0 && (
                        <>
                          <img
                            src={recipeImages[0]}
                            alt={recipe.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 text-white">
                            <span className="text-base font-bold">{recipe.title}</span>
                            <span className="text-xs opacity-90">By {recipe.author}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {recipes.slice(0, 3).map((recipe) => (
                <article key={recipe.id} className="rounded-xl border border-black/70 bg-white/45 p-4">
                  <span className="inline-flex rounded-full bg-[#f4d66d] px-2.5 py-1 text-[0.7rem] font-bold">
                    {recipe.category}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{recipe.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-neutral-700">By {recipe.author}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'recipes' && (
          <section className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="sticky top-5 flex flex-col gap-4 rounded-xl border border-black/70 bg-white/45 p-4">
              <h3 className="m-0 text-xl font-bold">Filter Recipes</h3>
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-700">
                  Main Ingredients
                </legend>
                <div className="mb-3 space-y-2 border-b border-black/20 pb-3">
                  {dishTypeOptions.slice(0, 2).map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={selectedDishTypes.includes(option)}
                        onChange={() => toggleDishType(option)}
                        className="h-4 w-4 accent-neutral-900"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  {dishTypeOptions.slice(2).map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={selectedDishTypes.includes(option)}
                        onChange={() => toggleDishType(option)}
                        className="h-4 w-4 accent-neutral-900"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-700">
                Dish Origin
                <select
                  value={selectedOrigin}
                  onChange={(event) => setSelectedOrigin(event.target.value)}
                  className="rounded-lg border border-black/80 bg-white/80 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
                >
                  <option value="All Origins">All Origins</option>
                  {originOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </aside>

            <div className="min-w-0 rounded-xl border border-black/70 bg-white/30 p-5">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="m-0 text-2xl font-bold">Recipes</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex self-start rounded-lg border border-black/70 bg-[#f4d66d] px-4 py-2.5 font-bold text-black transition hover:brightness-95"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Recipe
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-neutral-600">Loading recipes...</p>
              ) : filteredRecipes.length === 0 ? (
                <p className="text-sm text-neutral-600">No recipes match this dish type.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredRecipes.map((recipe) => {
                    const recipeImages = getRecipeImages(recipe)

                    return (
                      <article
                        key={recipe.id}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-black/70 bg-white/75 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none"
                        onClick={() => setSelectedRecipe(recipe)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setSelectedRecipe(recipe)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {recipeImages.length > 0 && (
                          <img
                            className="h-44 w-full object-cover"
                            src={recipeImages[0]}
                            alt={recipe.title}
                          />
                        )}

                        <div className="space-y-3 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex rounded-full bg-[#f4d66d] px-2.5 py-1 text-[0.7rem] font-bold text-neutral-900">
                              {recipe.category}
                            </span>
                            <span className="text-[0.72rem] font-bold uppercase tracking-wide text-neutral-700">
                              {getRecipeOrigin(recipe)}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-neutral-900">{recipe.title}</h3>
                          <p className="text-sm font-semibold text-neutral-700">By {recipe.author}</p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'about' && (
          <section className="about-page">
            <div className="about-card">
              <h2>About Quick Cooking Tips</h2>
              <p>
                Quick Cooking Tips is a simple recipe-sharing community for food lovers,
                beginners, and busy home cooks. Anyone can share a favorite recipe, a
                clever kitchen hack, or a meal they just made at home.
              </p>
              <p>
                You can post with your name or stay completely anonymous. The goal is to
                make recipe sharing accessible, friendly, and useful for everyone.
              </p>
            </div>
          </section>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Recipe</h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="recipe-form modal-form">
              <label>
                Recipe Name
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter recipe name"
                />
              </label>

              <label>
                Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Snack">Snack</option>
                </select>
              </label>

              <label>
                Dish Type
                <select value={dishType} onChange={(event) => setDishType(event.target.value)}>
                  {dishTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Dish Origin
                <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
                  {originOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="image-upload-section">
                <label>
                  Recipe Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="field-hint">Choose one or more photos from your device.</p>
                {imageUrls.length > 0 && (
                  <div className="image-preview-grid">
                    {imageUrls.map((imageUrl, index) => (
                      <img
                        key={`${imageUrl}-${index}`}
                        className="image-preview"
                        src={imageUrl}
                        alt={`Recipe preview ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="author-row">
                <label className="flex-row">
                  Posted by
                  <input
                    type="text"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    placeholder="Your name (optional)"
                    disabled={anonymous}
                  />
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                  />
                  Post anonymously
                </label>
              </div>

              <div className="ingredient-block">
                <h3>Ingredients</h3>

                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="ingredient-row">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(event) =>
                        updateIngredient(ingredient.id, 'name', event.target.value)
                      }
                      placeholder="Ingredient"
                    />

                    <select
                      value={ingredient.unit}
                      onChange={(event) =>
                        updateIngredient(ingredient.id, 'unit', event.target.value)
                      }
                    >
                      <option value="none">Select Unit</option>
                      <option value="oz">Ounces</option>
                      <option value="lb">Pounds</option>
                      <option value="pinch">Pinch</option>
                      <option value="g">Grams</option>
                      <option value="kg">Kilograms</option>
                      <option value="ml">Milliliters</option>
                      <option value="l">Liters</option>
                      <option value="tsp">Teaspoons</option>
                      <option value="tbsp">Tablespoons</option>
                      <option value="cup">Cups</option>
                      <option value="clove">Cloves</option>
                    </select>

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeIngredientRow(ingredient.id)}
                    >
                      X
                    </button>
                  </div>
                ))}

                <button type="button" className="secondary-button" onClick={addIngredientRow}>
                  + Add Row
                </button>
              </div>

              <label>
                Instructions
                <textarea
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  rows={5}
                  placeholder="Write the steps for the recipe"
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="modal-backdrop" onClick={() => setSelectedRecipe(null)}>
          <div
            className="modal-card recipe-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{selectedRecipe.title}</h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedRecipe(null)}
              >
                ×
              </button>
            </div>

            {(() => {
              const selectedImages = getRecipeImages(selectedRecipe)

              return selectedImages.length > 0 ? (
                <div className="recipe-gallery">
                  {selectedImages.map((image, index) => (
                    <img
                      key={`${selectedRecipe.id}-image-${index}`}
                      className="recipe-detail-image"
                      src={image}
                      alt={`${selectedRecipe.title} ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null
            })()}

            <span className="tag">{selectedRecipe.category}</span>
            <span className="origin-label">From {getRecipeOrigin(selectedRecipe)}</span>
            <p className="author-name">By {selectedRecipe.author}</p>

            <h4>Ingredients</h4>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={`${selectedRecipe.id}-detail-${index}`}>
                  {ingredient.name}
                  {ingredient.unit !== 'none' ? ` (${ingredient.unit})` : ''}
                </li>
              ))}
            </ul>

            <h4>Instructions</h4>
            <p className="instructions-text">{selectedRecipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App