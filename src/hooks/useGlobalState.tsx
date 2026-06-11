import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'in' | 'out';
  status: string;
}

export interface Order {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status: string;
  type: 'food' | 'shopping' | 'flight' | 'package' | 'health' | 'insurance';
  image?: string;
}

export interface Reward {
  id: string;
  title: string;
  desc: string;
  points: number;
  code?: string;
  date: string;
  status: 'Available' | 'Claimed';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  holderName: string;
}

export interface Card {
  id: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardType: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

const DEFAULT_BANKS: BankAccount[] = [];

const DEFAULT_CARDS: Card[] = [
  { id: 'card-1', cardHolder: 'Aarav Sharma', cardNumber: '•••• •••• •••• 9012', expiry: '12/28', cvv: '123', cardType: 'Visa' }
];

const DEFAULT_ADDRESSES: Address[] = [
  { id: 'adr-1', name: 'Aarav Sharma', street: '12, Link Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', zip: '400050', phone: '+91 98765 43210' }
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
};

const DEFAULT_TRANSACTIONS: Transaction[] = [];

const DEFAULT_ORDERS: Order[] = [];

const DEFAULT_REWARDS: Reward[] = [];

export interface GlobalContextType {
  balance: number;
  profile: UserProfile;
  transactions: Transaction[];
  orders: Order[];
  rewards: Reward[];
  points: number;
  bankAccounts: BankAccount[];
  cards: Card[];
  addresses: Address[];
  isLoading: boolean;
  updateBalance: (newBalance: number) => Promise<void>;
  updateProfile: (newProfile: UserProfile) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  claimReward: (rewardId: string) => Promise<void>;
  updatePoints: (newPoints: number) => Promise<void>;
  addBankAccount: (bank: Omit<BankAccount, 'id'>) => Promise<void>;
  addCard: (card: Omit<Card, 'id'>) => Promise<void>;
  addAddress: (adr: Omit<Address, 'id'>) => Promise<void>;
}

const GlobalStateContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('omnicart_balance');
    return saved ? parseFloat(saved) : 0;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('omnicart_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('omnicart_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('omnicart_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('omnicart_rewards');
    return saved ? JSON.parse(saved) : DEFAULT_REWARDS;
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('omnicart_points');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('omnicart_bank_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_BANKS;
  });

  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('omnicart_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('omnicart_addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        // Track the user on backend
        axios.post('/api/users/track', {
          email: user.email || 'aarav.sharma@email.com',
          name: user.displayName || 'Aarav Sharma',
          photo: user.photoURL || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
        }).catch(err => console.error('Error tracking login in store:', err));

        // Authenticated! Fetch from Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.balance !== undefined) setBalance(data.balance);
            if (data.points !== undefined) setPoints(data.points);
            const prof: UserProfile = {
              name: data.name || DEFAULT_PROFILE.name,
              email: data.email || user.email || DEFAULT_PROFILE.email,
              phone: data.phone || user.phoneNumber || DEFAULT_PROFILE.phone,
              avatar: data.avatar || DEFAULT_PROFILE.avatar
            };
            setProfile(prof);
          } else {
            // First time login! Set up user profile in Firestore
            const initialProfile: UserProfile = {
              name: user.displayName || 'Aarav Sharma',
              email: user.email || 'aarav.sharma@email.com',
              phone: user.phoneNumber || '+91 98765 43210',
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
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

          // Fetch Transactions
          const txSnap = await getDocs(collection(db, 'users', user.uid, 'transactions'));
          const fetchedTxs: Transaction[] = [];
          txSnap.forEach((doc) => {
            const data = doc.data();
            fetchedTxs.push({
              id: doc.id,
              title: data.title,
              subtitle: data.subtitle,
              amount: data.amount,
              type: data.type,
              status: data.status
            });
          });
          setTransactions(fetchedTxs.length > 0 ? fetchedTxs : DEFAULT_TRANSACTIONS);

          // Fetch Orders
          const ordSnap = await getDocs(collection(db, 'users', user.uid, 'orders'));
          const fetchedOrds: Order[] = [];
          ordSnap.forEach((doc) => {
            const data = doc.data();
            fetchedOrds.push({
              id: doc.id,
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

          // Fetch Rewards
          const rewSnap = await getDocs(collection(db, 'users', user.uid, 'rewards'));
          const fetchedRews: Reward[] = [];
          rewSnap.forEach((doc) => {
            const data = doc.data();
            fetchedRews.push({
              id: doc.id,
              title: data.title,
              desc: data.desc,
              points: data.points,
              code: data.code,
              date: data.date,
              status: data.status
            });
          });
          setRewards(fetchedRews.length > 0 ? fetchedRews : DEFAULT_REWARDS);

          // Fetch Bank Accounts from Firestore
          const bankSnap = await getDocs(collection(db, 'users', user.uid, 'bankAccounts'));
          const fetchedBanks: BankAccount[] = [];
          bankSnap.forEach((doc) => {
            const data = doc.data();
            fetchedBanks.push({
              id: doc.id,
              bankName: data.bankName,
              accountNumber: data.accountNumber,
              accountType: data.accountType,
              holderName: data.holderName
            });
          });
          setBankAccounts(fetchedBanks.length > 0 ? fetchedBanks : DEFAULT_BANKS);

          // Fetch Cards from Firestore
          const cardSnap = await getDocs(collection(db, 'users', user.uid, 'cards'));
          const fetchedCards: Card[] = [];
          cardSnap.forEach((doc) => {
            const data = doc.data();
            fetchedCards.push({
              id: doc.id,
              cardHolder: data.cardHolder,
              cardNumber: data.cardNumber,
              expiry: data.expiry,
              cvv: data.cvv,
              cardType: data.cardType
            });
          });
          setCards(fetchedCards.length > 0 ? fetchedCards : DEFAULT_CARDS);

          // Fetch Addresses from Firestore
          const adrSnap = await getDocs(collection(db, 'users', user.uid, 'addresses'));
          const fetchedAdrs: Address[] = [];
          adrSnap.forEach((doc) => {
            const data = doc.data();
            fetchedAdrs.push({
              id: doc.id,
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
        // Logged out: fallback to localStorage or default
        const savedBalance = localStorage.getItem('omnicart_balance');
        const savedProfile = localStorage.getItem('omnicart_profile');
        const savedTransactions = localStorage.getItem('omnicart_transactions');
        const savedOrders = localStorage.getItem('omnicart_orders');
        const savedRewards = localStorage.getItem('omnicart_rewards');
        const savedPoints = localStorage.getItem('omnicart_points');
        const savedBanks = localStorage.getItem('omnicart_bank_accounts');
        const savedCards = localStorage.getItem('omnicart_cards');
        const savedAddresses = localStorage.getItem('omnicart_addresses');

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

  // Sync state between tabs/local dispatches
  useEffect(() => {
    const handleUpdate = () => {
      const savedBalance = localStorage.getItem('omnicart_balance');
      const savedProfile = localStorage.getItem('omnicart_profile');
      const savedTransactions = localStorage.getItem('omnicart_transactions');
      const savedOrders = localStorage.getItem('omnicart_orders');
      const savedRewards = localStorage.getItem('omnicart_rewards');
      const savedPoints = localStorage.getItem('omnicart_points');
      const savedBanks = localStorage.getItem('omnicart_bank_accounts');
      const savedCards = localStorage.getItem('omnicart_cards');
      const savedAddresses = localStorage.getItem('omnicart_addresses');

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

    window.addEventListener('omnicart_state_change', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('omnicart_state_change', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateBalance = async (newBalance: number) => {
    localStorage.setItem('omnicart_balance', newBalance.toString());
    setBalance(newBalance);
    window.dispatchEvent(new Event('omnicart_state_change'));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { balance: newBalance });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const updateProfile = async (newProfile: UserProfile) => {
    localStorage.setItem('omnicart_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    window.dispatchEvent(new Event('omnicart_state_change'));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          name: newProfile.name,
          phone: newProfile.phone,
          avatar: newProfile.avatar
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTxId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...tx,
      id: newTxId
    };
    const updated = [newTx, ...transactions];
    localStorage.setItem('omnicart_transactions', JSON.stringify(updated));
    setTransactions(updated);
    window.dispatchEvent(new Event('omnicart_state_change'));

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'transactions', newTxId), {
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

  const updatePoints = async (newPoints: number) => {
    localStorage.setItem('omnicart_points', newPoints.toString());
    setPoints(newPoints);
    window.dispatchEvent(new Event('omnicart_state_change'));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { points: newPoints });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'date'>) => {
    const newOrdId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...order,
      id: newOrdId,
      date: 'Just now'
    };
    
    // Track order on the backend admin store (Part 4)
    const userEmail = auth.currentUser?.email || profile?.email || 'guest@omnicart.com';
    const userName = auth.currentUser?.displayName || profile?.name || 'Guest User';
    try {
      axios.post('/api/orders/track', {
        orderId: newOrdId,
        userEmail,
        userName,
        productName: order.title,
        category: order.type || 'Shopping',
        amount: order.amount,
        status: order.status || 'PAID',
        uropayId: 'Wallet',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error tracking order:', err);
    }
    const updated = [newOrder, ...orders];
    localStorage.setItem('omnicart_orders', JSON.stringify(updated));
    setOrders(updated);

    const pointsEarned = Math.max(5, Math.floor(order.amount / 100));
    const nextPoints = points + pointsEarned;
    localStorage.setItem('omnicart_points', nextPoints.toString());
    setPoints(nextPoints);

    const discountVal = Math.max(50, Math.floor(order.amount * 0.05));
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newRewardId = `rew-${Date.now()}`;
    const newReward: Reward = {
      id: newRewardId,
      title: `₹${discountVal} Special Cashback`,
      desc: `Earned from ordering "${order.title}". Coupon code OMNI-REWD-${codeNum} is active.`,
      points: Math.max(10, Math.floor(pointsEarned / 2)),
      code: `OMNI-REWD-${codeNum}`,
      date: 'Just now',
      status: 'Available'
    };
    const updatedRewards = [newReward, ...rewards];
    localStorage.setItem('omnicart_rewards', JSON.stringify(updatedRewards));
    setRewards(updatedRewards);

    window.dispatchEvent(new Event('omnicart_state_change'));

    if (auth.currentUser) {
      try {
        // Create Order
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'orders', newOrdId), {
          title: order.title,
          subtitle: order.subtitle,
          amount: order.amount,
          date: 'Just now',
          status: order.status,
          type: order.type,
          image: order.image || ''
        });

        // Create Reward
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'rewards', newRewardId), {
          title: newReward.title,
          desc: newReward.desc,
          points: newReward.points,
          code: newReward.code || '',
          date: newReward.date,
          status: newReward.status
        });

        // Update User Points
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { points: nextPoints });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const claimReward = async (rewardId: string) => {
    const updated = rewards.map(r => r.id === rewardId ? { ...r, status: 'Claimed' as const } : r);
    localStorage.setItem('omnicart_rewards', JSON.stringify(updated));
    setRewards(updated);
    window.dispatchEvent(new Event('omnicart_state_change'));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'rewards', rewardId), {
          status: 'Claimed'
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}/rewards/${rewardId}`);
      }
    }
  };

  const addBankAccount = async (bank: Omit<BankAccount, "id">) => {
    const newBankId = `bank-${Date.now()}`;
    const newBank: BankAccount = { ...bank, id: newBankId };
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

  const addCard = async (card: Omit<Card, "id">) => {
    const newCardId = `card-${Date.now()}`;
    const newCard: Card = { ...card, id: newCardId };
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

  const addAddress = async (adr: Omit<Address, "id">) => {
    const newAdrId = `adr-${Date.now()}`;
    const newAdr: Address = { ...adr, id: newAdrId };
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

  return (
    <GlobalStateContext.Provider value={{
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
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    // Graceful fallback to local behavior just in case someone is rendering outside context,
    // but we will wrap App in Provider so context is always available!
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
