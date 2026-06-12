import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
const DEFAULT_BANKS = [];
const DEFAULT_CARDS = [
  { id: "card-1", cardHolder: "Aarav Sharma", cardNumber: "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 9012", expiry: "12/28", cvv: "123", cardType: "Visa" }
];
const DEFAULT_ADDRESSES = [
  { id: "adr-1", name: "Aarav Sharma", street: "12, Link Road, Bandra West", city: "Mumbai", state: "Maharashtra", zip: "400050", phone: "+91 98765 43210" }
];
const DEFAULT_PROFILE = {
  name: "Aarav Sharma",
  email: "aarav.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
};
const DEFAULT_TRANSACTIONS = [];
const DEFAULT_ORDERS = [];
const DEFAULT_REWARDS = [];
const GlobalStateContext = createContext(void 0);
export function GlobalStateProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("omnicart_balance");
    return saved ? parseFloat(saved) : 0;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("omnicart_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("omnicart_transactions");
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("omnicart_orders");
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem("omnicart_rewards");
    return saved ? JSON.parse(saved) : DEFAULT_REWARDS;
  });
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("omnicart_points");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bankAccounts, setBankAccounts] = useState(() => {
    const saved = localStorage.getItem("omnicart_bank_accounts");
    return saved ? JSON.parse(saved) : DEFAULT_BANKS;
  });
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("omnicart_cards");
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("omnicart_addresses");
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        axios.post("/api/users/track", {
          email: user.email || "aarav.sharma@email.com",
          name: user.displayName || "Aarav Sharma",
          photo: user.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
        }).catch((err) => console.error("Error tracking login in store:", err));
        const userRef = doc(db, "users", user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.balance !== void 0) setBalance(data.balance);
            if (data.points !== void 0) setPoints(data.points);
            const prof = {
              name: data.name || DEFAULT_PROFILE.name,
              email: data.email || user.email || DEFAULT_PROFILE.email,
              phone: data.phone || user.phoneNumber || DEFAULT_PROFILE.phone,
              avatar: data.avatar || DEFAULT_PROFILE.avatar
            };
            setProfile(prof);
          } else {
            const initialProfile = {
              name: user.displayName || "Aarav Sharma",
              email: user.email || "aarav.sharma@email.com",
              phone: user.phoneNumber || "+91 98765 43210",
              avatar: user.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
            };
            await setDoc(userRef, {
              ...initialProfile,
              balance: 0,
              points: 0
            });
            setProfile(initialProfile);
            setBalance(0);
            setPoints(0);
          }
          const txSnap = await getDocs(collection(db, "users", user.uid, "transactions"));
          const fetchedTxs = [];
          txSnap.forEach((doc2) => {
            const data = doc2.data();
            fetchedTxs.push({
              id: doc2.id,
              title: data.title,
              subtitle: data.subtitle,
              amount: data.amount,
              type: data.type,
              status: data.status
            });
          });
          setTransactions(fetchedTxs.length > 0 ? fetchedTxs : DEFAULT_TRANSACTIONS);
          const ordSnap = await getDocs(collection(db, "users", user.uid, "orders"));
          const fetchedOrds = [];
          ordSnap.forEach((doc2) => {
            const data = doc2.data();
            fetchedOrds.push({
              id: doc2.id,
              title: data.title,
              subtitle: data.subtitle,
              amount: data.amount,
              date: data.date,
              status: data.status,
              type: data.type,
              image: data.image
            });
          });
          setOrders(fetchedOrds.length > 0 ? fetchedOrds : DEFAULT_ORDERS);
          const rewSnap = await getDocs(collection(db, "users", user.uid, "rewards"));
          const fetchedRews = [];
          rewSnap.forEach((doc2) => {
            const data = doc2.data();
            fetchedRews.push({
              id: doc2.id,
              title: data.title,
              desc: data.desc,
              points: data.points,
              code: data.code,
              date: data.date,
              status: data.status
            });
          });
          setRewards(fetchedRews.length > 0 ? fetchedRews : DEFAULT_REWARDS);
          const bankSnap = await getDocs(collection(db, "users", user.uid, "bankAccounts"));
          const fetchedBanks = [];
          bankSnap.forEach((doc2) => {
            const data = doc2.data();
            fetchedBanks.push({
              id: doc2.id,
              bankName: data.bankName,
              accountNumber: data.accountNumber,
              accountType: data.accountType,
              holderName: data.holderName
            });
          });
          setBankAccounts(fetchedBanks.length > 0 ? fetchedBanks : DEFAULT_BANKS);
          const cardSnap = await getDocs(collection(db, "users", user.uid, "cards"));
          const fetchedCards = [];
          cardSnap.forEach((doc2) => {
            const data = doc2.data();
            fetchedCards.push({
              id: doc2.id,
              cardHolder: data.cardHolder,
              cardNumber: data.cardNumber,
              expiry: data.expiry,
              cvv: data.cvv,
              cardType: data.cardType
            });
          });
          setCards(fetchedCards.length > 0 ? fetchedCards : DEFAULT_CARDS);
          const adrSnap = await getDocs(collection(db, "users", user.uid, "addresses"));
          const fetchedAdrs = [];
          adrSnap.forEach((doc2) => {
            const data = doc2.data();
            fetchedAdrs.push({
              id: doc2.id,
              name: data.name,
              street: data.street,
              city: data.city,
              state: data.state,
              zip: data.zip,
              phone: data.phone
            });
          });
          setAddresses(fetchedAdrs.length > 0 ? fetchedAdrs : DEFAULT_ADDRESSES);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        const savedBalance = localStorage.getItem("omnicart_balance");
        const savedProfile = localStorage.getItem("omnicart_profile");
        const savedTransactions = localStorage.getItem("omnicart_transactions");
        const savedOrders = localStorage.getItem("omnicart_orders");
        const savedRewards = localStorage.getItem("omnicart_rewards");
        const savedPoints = localStorage.getItem("omnicart_points");
        const savedBanks = localStorage.getItem("omnicart_bank_accounts");
        const savedCards = localStorage.getItem("omnicart_cards");
        const savedAddresses = localStorage.getItem("omnicart_addresses");
        setBalance(savedBalance ? parseFloat(savedBalance) : 0);
        setProfile(savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE);
        setTransactions(savedTransactions ? JSON.parse(savedTransactions) : DEFAULT_TRANSACTIONS);
        setOrders(savedOrders ? JSON.parse(savedOrders) : DEFAULT_ORDERS);
        setRewards(savedRewards ? JSON.parse(savedRewards) : DEFAULT_REWARDS);
        setPoints(savedPoints ? parseInt(savedPoints, 10) : 180);
        setBankAccounts(savedBanks ? JSON.parse(savedBanks) : DEFAULT_BANKS);
        setCards(savedCards ? JSON.parse(savedCards) : DEFAULT_CARDS);
        setAddresses(savedAddresses ? JSON.parse(savedAddresses) : DEFAULT_ADDRESSES);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const handleUpdate = () => {
      const savedBalance = localStorage.getItem("omnicart_balance");
      const savedProfile = localStorage.getItem("omnicart_profile");
      const savedTransactions = localStorage.getItem("omnicart_transactions");
      const savedOrders = localStorage.getItem("omnicart_orders");
      const savedRewards = localStorage.getItem("omnicart_rewards");
      const savedPoints = localStorage.getItem("omnicart_points");
      const savedBanks = localStorage.getItem("omnicart_bank_accounts");
      const savedCards = localStorage.getItem("omnicart_cards");
      const savedAddresses = localStorage.getItem("omnicart_addresses");
      if (savedBalance) setBalance(parseFloat(savedBalance));
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedRewards) setRewards(JSON.parse(savedRewards));
      if (savedPoints) setPoints(parseInt(savedPoints, 10));
      if (savedBanks) setBankAccounts(JSON.parse(savedBanks));
      if (savedCards) setCards(JSON.parse(savedCards));
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
    };
    window.addEventListener("omnicart_state_change", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("omnicart_state_change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);
  const updateBalance = async (newBalance) => {
    localStorage.setItem("omnicart_balance", newBalance.toString());
    setBalance(newBalance);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { balance: newBalance });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };
  const updateProfile = async (newProfile) => {
    localStorage.setItem("omnicart_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          name: newProfile.name,
          phone: newProfile.phone,
          avatar: newProfile.avatar
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };
  const addTransaction = async (tx) => {
    const newTxId = `tx-${Date.now()}`;
    const newTx = {
      ...tx,
      id: newTxId
    };
    const updated = [newTx, ...transactions];
    localStorage.setItem("omnicart_transactions", JSON.stringify(updated));
    setTransactions(updated);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "transactions", newTxId), {
          title: tx.title,
          subtitle: tx.subtitle,
          amount: tx.amount,
          type: tx.type,
          status: tx.status
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser.uid}/transactions/${newTxId}`);
      }
    }
  };
  const updatePoints = async (newPoints) => {
    localStorage.setItem("omnicart_points", newPoints.toString());
    setPoints(newPoints);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { points: newPoints });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };
  const addOrder = async (order) => {
    const newOrdId = `ord-${Date.now()}`;
    const newOrder = {
      ...order,
      id: newOrdId,
      date: "Just now"
    };
    const userEmail = auth.currentUser?.email || profile?.email || "guest@omnicart.com";
    const userName = auth.currentUser?.displayName || profile?.name || "Guest User";
    try {
      axios.post("/api/orders/track", {
        orderId: newOrdId,
        userEmail,
        userName,
        productName: order.title,
        category: order.type || "Shopping",
        amount: order.amount,
        status: order.status || "PAID",
        uropayId: "Wallet",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (err) {
      console.error("Error tracking order:", err);
    }
    const updated = [newOrder, ...orders];
    localStorage.setItem("omnicart_orders", JSON.stringify(updated));
    setOrders(updated);
    const pointsEarned = Math.max(5, Math.floor(order.amount / 100));
    const nextPoints = points + pointsEarned;
    localStorage.setItem("omnicart_points", nextPoints.toString());
    setPoints(nextPoints);
    const discountVal = Math.max(50, Math.floor(order.amount * 0.05));
    const codeNum = Math.floor(1e3 + Math.random() * 9e3);
    const newRewardId = `rew-${Date.now()}`;
    const newReward = {
      id: newRewardId,
      title: `\u20B9${discountVal} Special Cashback`,
      desc: `Earned from ordering "${order.title}". Coupon code OMNI-REWD-${codeNum} is active.`,
      points: Math.max(10, Math.floor(pointsEarned / 2)),
      code: `OMNI-REWD-${codeNum}`,
      date: "Just now",
      status: "Available"
    };
    const updatedRewards = [newReward, ...rewards];
    localStorage.setItem("omnicart_rewards", JSON.stringify(updatedRewards));
    setRewards(updatedRewards);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "orders", newOrdId), {
          title: order.title,
          subtitle: order.subtitle,
          amount: order.amount,
          date: "Just now",
          status: order.status,
          type: order.type,
          image: order.image || ""
        });
        await setDoc(doc(db, "users", auth.currentUser.uid, "rewards", newRewardId), {
          title: newReward.title,
          desc: newReward.desc,
          points: newReward.points,
          code: newReward.code || "",
          date: newReward.date,
          status: newReward.status
        });
        await updateDoc(doc(db, "users", auth.currentUser.uid), { points: nextPoints });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }
  };
  const claimReward = async (rewardId) => {
    const updated = rewards.map((r) => r.id === rewardId ? { ...r, status: "Claimed" } : r);
    localStorage.setItem("omnicart_rewards", JSON.stringify(updated));
    setRewards(updated);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid, "rewards", rewardId), {
          status: "Claimed"
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}/rewards/${rewardId}`);
      }
    }
  };
  const addBankAccount = async (bank) => {
    const newBankId = `bank-${Date.now()}`;
    const newBank = { ...bank, id: newBankId };
    const updated = [...bankAccounts, newBank];
    localStorage.setItem("omnicart_bank_accounts", JSON.stringify(updated));
    setBankAccounts(updated);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "bankAccounts", newBankId), bank);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser.uid}/bankAccounts/${newBankId}`);
      }
    }
  };
  const addCard = async (card) => {
    const newCardId = `card-${Date.now()}`;
    const newCard = { ...card, id: newCardId };
    const updated = [...cards, newCard];
    localStorage.setItem("omnicart_cards", JSON.stringify(updated));
    setCards(updated);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "cards", newCardId), card);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser.uid}/cards/${newCardId}`);
      }
    }
  };
  const addAddress = async (adr) => {
    const newAdrId = `adr-${Date.now()}`;
    const newAdr = { ...adr, id: newAdrId };
    const updated = [...addresses, newAdr];
    localStorage.setItem("omnicart_addresses", JSON.stringify(updated));
    setAddresses(updated);
    window.dispatchEvent(new Event("omnicart_state_change"));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "addresses", newAdrId), adr);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser.uid}/addresses/${newAdrId}`);
      }
    }
  };
  return <GlobalStateContext.Provider value={{
    balance,
    profile,
    transactions,
    orders,
    rewards,
    points,
    bankAccounts,
    cards,
    addresses,
    isLoading,
    updateBalance,
    updateProfile,
    addTransaction,
    addOrder,
    claimReward,
    updatePoints,
    addBankAccount,
    addCard,
    addAddress
  }}>
      {children}
    </GlobalStateContext.Provider>;
}
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
